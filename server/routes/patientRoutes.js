const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const Reminder = require('../models/Reminder'); // ⬅️ Import Reminder model

// REGISTER PATIENT
router.post('/register', async (req, res) => {
  try {
    const patient = new Patient(req.body);
    await patient.save();
    res.status(201).json({ message: "Patient registered successfully", patient });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// LOGIN PATIENT
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const patient = await Patient.findOne({ email, password });
    if (!patient) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    res.json({ message: "Login successful", patient });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// SAVE PATIENT DETAILS (dashboard)
router.patch('/dashboard/save', async (req, res) => {
  const { email, bloodGroup, allergy, history } = req.body;
  try {
    const patient = await Patient.findOneAndUpdate(
      { email },
      { bloodGroup, allergy, history },
      { new: true }
    );
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json({ message: 'Patient details updated successfully', patient });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// SET MEDICINE REMINDEr

router.post("/reminder", async (req, res) => {
  const { email, medicine, time } = req.body;
  try {
    const reminder = new Reminder({ email, medicine, time });
    await reminder.save();
    res.status(201).json({ message: "Reminder scheduled!" });
  } catch (err) {
    res.status(500).json({ message: "Failed to set reminder." });
  }
});


module.exports = router;

