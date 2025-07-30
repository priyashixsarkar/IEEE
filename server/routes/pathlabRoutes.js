const express = require("express");
const router = express.Router();
const Pathlab = require("../models/Pathlab");

// ✅ Pathlab Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password required" });

  try {
    const pathlab = await Pathlab.findOne({ email, password });
    if (!pathlab) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({ message: "Login successful", pathlab });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ Pathlab Register
router.post("/register", async (req, res) => {
  try {
    const { name, owner, contact, address, license, email, password } = req.body;

    if (!name || !owner || !contact || !address || !license || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newPathlab = new Pathlab({
      name,
      ownerName: owner,
      contactNumber: contact,
      address,
      licenseNumber: license,
      email,
      password
    });

    const savedLab = await newPathlab.save();
    res.status(201).json({ message: "Pathlab registered", pathlab: savedLab });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
});

// ✅ Update Test Availability
router.patch("/tests", async (req, res) => {
  const { email, tests } = req.body;

  if (!email || !Array.isArray(tests)) {
    return res.status(400).json({ message: "Missing email or invalid tests format" });
  }

  try {
    const updatedLab = await Pathlab.findOneAndUpdate(
      { email },
      { $set: { tests } },
      { new: true }
    );

    if (!updatedLab) {
      return res.status(404).json({ message: "Pathlab not found" });
    }

    res.status(200).json({ message: "Tests updated", pathlab: updatedLab });
  } catch (err) {
    res.status(500).json({ message: "Failed to save tests", error: err.message });
  }
});

// ✅ Fetch Pathlab Info by Email (for dashboard refresh)
router.get("/me", async (req, res) => {
  const email = req.query.email;

  if (!email) {
    return res.status(400).json({ message: "Email query is required" });
  }

  try {
    const pathlab = await Pathlab.findOne({ email });
    if (!pathlab) {
      return res.status(404).json({ message: "Pathlab not found" });
    }

    res.status(200).json({
      email: pathlab.email,
      name: pathlab.name,
      tests: pathlab.tests || []
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch pathlab", error: err.message });
  }
});

// GET: Find all pathlabs where a specific test is available
router.get("/available-tests", async (req, res) => {
  const { test } = req.query;

  if (!test) return res.status(400).json({ message: "Test query is required" });

  try {
    const labs = await Pathlab.find({
      tests: { $elemMatch: { testName: test, available: true } },
    }).select("name address contactNumber");

    res.json({ labs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching labs", error: err.message });
  }
});

// GET: Search for labs offering a specific test
router.get("/search", async (req, res) => {
  const { test } = req.query;

  if (!test) return res.status(400).json({ message: "Test name is required" });

  try {
    const pathlabs = await Pathlab.find({
      tests: {
        $elemMatch: { testName: { $regex: new RegExp(test, "i") }, available: true }
      }
    });
    res.json({ pathlabs });
  } catch (err) {
    res.status(500).json({ message: "Search failed", error: err.message });
  }
});


module.exports = router;
