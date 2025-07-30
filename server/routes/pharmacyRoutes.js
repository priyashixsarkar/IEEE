const express = require('express');
const router = express.Router();
const Pharmacy = require('../models/Pharmacy');
const bcrypt = require('bcrypt');

// --- Register a new pharmacy ---
router.post('/register', async (req, res) => {
  try {
    const {
      name,
      ownerName,
      contactNumber,
      address,
      licenseNumber,
      email,
      password,
      licenseProof
    } = req.body;

    // Validate required fields
    if (!name || !ownerName || !contactNumber || !address || !licenseNumber || !email || !password || !licenseProof) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const existingPharmacy = await Pharmacy.findOne({ email });
    if (existingPharmacy) {
      return res.status(400).json({ error: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newPharmacy = new Pharmacy({
      name,
      ownerName,
      contactNumber,
      address,
      licenseNumber,
      email,
      password: hashedPassword,
      licenseProof,
      inventory: []
    });

    await newPharmacy.save();
    res.status(201).json({ message: "Pharmacy registered successfully", pharmacy: newPharmacy });
  } catch (error) {
    res.status(500).json({ error: "Server error: " + error.message });
  }
});

// --- Login a pharmacy ---
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log("Login request body:", req.body);

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const pharmacy = await Pharmacy.findOne({ email });
    console.log("Pharmacy found:", pharmacy);

    if (!pharmacy) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, pharmacy.password);
    console.log("Password matched:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    return res.status(200).json({ message: "Login successful", pharmacy });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error: " + error.message });
  }
});

// --- Update inventory ---
router.patch('/inventory', async (req, res) => {
  const { email, inventory } = req.body;

  if (!email || !Array.isArray(inventory)) {
    return res.status(400).json({ error: "Email and inventory array are required." });
  }

  try {
    const updatedPharmacy = await Pharmacy.findOneAndUpdate(
      { email },
      { inventory },
      { new: true }
    );

    if (!updatedPharmacy) {
      return res.status(404).json({ error: "Pharmacy not found." });
    }

    res.json({ message: "Inventory updated successfully", pharmacy: updatedPharmacy });
  } catch (error) {
    res.status(500).json({ error: "Server error: " + error.message });
  }
});

// --- Get pharmacy inventory by email (for dashboard) ---
router.get('/me', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const pharmacy = await Pharmacy.findOne({ email });
    if (!pharmacy) {
      return res.status(404).json({ error: "Pharmacy not found" });
    }

    res.json({ inventory: pharmacy.inventory });
  } catch (error) {
    console.error("Error in /pharmacy/me:", error);
    res.status(500).json({ error: "Server error: " + error.message });
  }
});

// --- Search pharmacies by medicine name ---
router.get('/search', async (req, res) => {
  const { medicine } = req.query;

  if (!medicine) {
    return res.status(400).json({ error: "Medicine name is required in query." });
  }

  try {
    const regex = new RegExp(medicine, 'i'); // Case-insensitive search
    const pharmacies = await Pharmacy.find({
      inventory: {
        $elemMatch: {
          medicineName: regex,
          stock: { $gt: 0 }
        }
      }
    });

    res.json({ pharmacies });
  } catch (error) {
    res.status(500).json({ error: "Server error: " + error.message });
  }
});

module.exports = router;
