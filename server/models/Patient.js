const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  gender: { type: String, required: true },
  dob: { type: Date, required: true },
  mobile: { type: String, required: true },
  // models/Patient.js
email: { type: String, unique: true },
  address: { type: String },
  password: { type: String, required: true },
  // --- Add these fields for dashboard ---
  bloodGroup: { type: String },
  allergy: { type: String },
  history: { type: String }
}, { timestamps: true },
);

module.exports = mongoose.model('Patient', patientSchema);
