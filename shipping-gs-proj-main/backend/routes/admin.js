// routes/admin.js
const express = require("express");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// GET /api/AdminDetails - Protected Route for Logged-in User
router.get("/AdminDetails", authMiddleware, async (req, res) => {
  try {
    // Fetch the logged-in user by their ID and select only the 'name' field
    const admin = await User.findById(req.userId).select("name");

    if (!admin)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res.json({ success: true, name: admin.name });
  } catch (error) {
    console.error("Error fetching admin details:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
