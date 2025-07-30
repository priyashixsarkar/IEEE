// routes/appointments.js

const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");

const allSlots = [
  "10:00 AM", "10:30 AM", "11:00 AM",
  "11:30 AM", "12:00 PM", "2:00 PM",
  "2:30 PM", "3:00 PM", "3:30 PM"
];

// Route to get slots
router.get('/slots/:doctorId/:date', async (req, res) => {
  const { doctorId, date } = req.params; // date is like "2025-07-30"

  try {
    const bookings = await Appointment.find({ doctorId, date });
    const occupiedSlots = bookings.map(b => b.time); // "10:00 AM"

    res.json({ slots: allSlots, occupiedSlots });
  } catch (err) {
    res.status(500).json({ message: "Error fetching slots", error: err.message });
  }
});

// routes/appointments.js

// Route to book an appointment
router.post("/book", async (req, res) => {
  const { patientEmail, doctorId, time } = req.body;

  if (!patientEmail || !doctorId || !time) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Fetch patient name from DB
    const Patient = require("../models/Patient");
    const patient = await Patient.findOne({ email: patientEmail });
    const patientName = patient ? patient.name : "Unknown";

    const appointment = new Appointment({
      patientEmail,
      patientName, // Save the name
      doctorId,
      date: time.split("T")[0],
      time
    });

    await appointment.save();
    res.status(201).json({ message: "Appointment booked successfully", appointment });
  } catch (err) {
    res.status(500).json({ message: "Failed to book appointment", error: err.message });
  }
});


// Route to get all appointments for a doctor
router.get("/bookings/:doctorId", async (req, res) => {
  const { doctorId } = req.params;

  try {
    const appointments = await Appointment.find({ doctorId });

    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch appointments", error: err.message });
  }
});



module.exports = router;
