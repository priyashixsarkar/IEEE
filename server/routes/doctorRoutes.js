const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');

// Doctor Registration
router.post("/register", async (req, res) => {
  try {
    const doctor = new Doctor({
      name: req.body.name,
      gender: req.body.gender,
      dob: req.body.dob,
      mobile: req.body.mobile,
      email: req.body.email,
      address: req.body.address,
      registrationNumber: req.body.registrationNumber,
      password: req.body.password,
      specialization: req.body.specialization
    });

    const saved = await doctor.save();
    res.status(201).json({ message: "Doctor registered", doctor: saved });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Registration failed" });
  }
});

// Doctor Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password required" });

  try {
    const doctor = await Doctor.findOne({ email, password });

    if (!doctor)
      return res.status(401).json({ message: "Invalid email or password" });

    res.json({ message: "Login successful", doctor });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get all doctors
router.get("/", async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json({ doctors });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch doctors" });
  }
});

// Update specialization by email
router.put("/specialization/email/:email", async (req, res) => {
  try {
    const { specialization } = req.body;

    const doctor = await Doctor.findOneAndUpdate(
      { email: req.params.email },
      { specialization },
      { new: true }
    );

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json({ message: "Specialization updated", doctor });
  } catch (err) {
    res.status(500).json({ message: "Error updating specialization", error: err.message });
  }
});

// Get doctor by email
router.get("/:email", async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ email: req.params.email });
    res.json(doctor);
  } catch {
    res.status(500).json({ error: "Doctor not found" });
  }
});

// Get booked appointments for doctor by email
router.get("/patients/:email", async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ email: req.params.email });
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const appointments = await Appointment.find({ doctorId: doctor._id });

    const enrichedPatients = await Promise.all(
      appointments.map(async (a) => {
        const patient = await Patient.findOne({ email: a.patientEmail });
        return {
          name: patient?.name || a.patientEmail,
          gender: patient?.gender || "-",
          mobile: patient?.mobile || "-",
          date: a.date,
          time: a.time
        };
      })
    );

    res.json(enrichedPatients);
  } catch (err) {
    res.status(500).json({ message: "Error fetching patients", error: err.message });
  }
});

module.exports = router;
