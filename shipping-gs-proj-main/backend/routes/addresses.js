// routes/addressRoutes.js

const express = require("express");
const Address = require("../models/Address");
const authMiddleware = require("../middleware/authMiddleware"); // If routes are protected

const router = express.Router();

// Apply authentication middleware to all routes below (if needed)

// Create a new address (Protected Route)
router.post("/postaddresses", async (req, res) => {
  const { name, street, street2, zip, city, state, country } = req.body;

  // Validate required fields
  if (!name || !street || !zip || !city || !state || !country) {
    return res
      .status(400)
      .json({ message: "Please fill in all required fields." });
  }

  const newAddress = new Address({
    name,
    street,
    street2,
    zip,
    city,
    state,
    country,
  });

  try {
    const savedAddress = await newAddress.save();
    res.status(201).json(savedAddress);
  } catch (error) {
    console.error("Error creating address:", error);
    res
      .status(400)
      .json({ message: "Error creating address", error: error.message });
  }
});

// Fetch all addresses (Protected Route)
router.get("/getaddresses", async (req, res) => {
  try {
    const addresses = await Address.find().sort({ date: -1 }); // Sort by latest
    res.json(addresses);
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete an address by ID (Protected Route)
router.delete("/deleteaddress/:id", async (req, res) => {
  try {
    const address = await Address.findByIdAndDelete(req.params.id);
    if (!address) {
      return res.status(404).json({ message: "Address not found." });
    }
    res.json({ message: "Address deleted successfully." });
  } catch (error) {
    console.error("Error deleting address:", error);
    res.status(500).json({ message: "Server error." });
  }
});

// Update an address by ID (Protected Route)
router.put("/updateaddress/:id", async (req, res) => {
  const { name, street, street2, zip, city, state, country } = req.body;

  // Validate required fields
  if (!name || !street || !zip || !city || !state || !country) {
    return res
      .status(400)
      .json({ message: "Please fill in all required fields." });
  }

  try {
    const updatedAddress = await Address.findByIdAndUpdate(
      req.params.id,
      { name, street, street2, zip, city, state, country },
      { new: true, runValidators: true }
    );

    if (!updatedAddress) {
      return res.status(404).json({ message: "Address not found." });
    }

    res.json(updatedAddress);
  } catch (error) {
    console.error("Error updating address:", error);
    res
      .status(400)
      .json({ message: "Error updating address", error: error.message });
  }
});

// Get a single address by ID (Protected Route)
router.get("/getaddress/:id", async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);
    if (!address) {
      return res.status(404).json({ message: "Address not found." });
    }
    res.json(address);
  } catch (error) {
    console.error("Error fetching address:", error);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
