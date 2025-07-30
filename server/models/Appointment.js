const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  patientEmail: String,
  patientName: String, // <-- Add this line
  doctorId: mongoose.Schema.Types.ObjectId,
  date: String, // "2025-07-30"
  time: String  // "10:00 AM"
});

module.exports = mongoose.model("Appointment", appointmentSchema);
