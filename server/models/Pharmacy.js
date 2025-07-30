// models/Pharmacy.js
const mongoose = require('mongoose');

const pharmacySchema = new mongoose.Schema({
  name: { type: String, required: true },
  ownerName: { type: String, required: true },
  contactNumber: { type: String, required: true },
  address: { type: String, required: true },
  licenseNumber: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // <--- ADD THIS
  password: { type: String, required: true },
  licenseProof: { type: String },
  inventory: [{
    medicineName: String,
    stock: Number
  }]
}, { timestamps: true });

module.exports = mongoose.model('Pharmacy', pharmacySchema);