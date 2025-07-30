const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  gender: { type: String, required: true },
  dob: { type: Date, required: true },
  mobile: { type: String, required: true },
  email: { type: String },
  address: { type: String },
  registrationNumber: { type: String, required: true },
  password: { type: String, required: true },
  specialization: { type: String, default: "" } // Add this
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);