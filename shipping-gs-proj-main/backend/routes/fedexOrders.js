// routes/fedexOrderRoutes.js

const express = require("express");
const FedexOrder = require("../models/FedexOrder");
const authMiddleware = require("../middleware/authMiddleware"); // If routes are protected

const router = express.Router();

// Apply authentication middleware to all routes below (if needed)
// router.use(authMiddleware);

// Fetch all FedEx orders
router.get("/getfedexorder", async (req, res) => {
  try {
    const orders = await FedexOrder.find().sort({ createdAt: -1 }); // Sort by latest
    res.json(orders);
  } catch (error) {
    console.error("Error fetching FedEx orders:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new FedEx order
router.post("/createfedexorder", async (req, res) => {
  const { no, status, note, price, orderId, action } = req.body;

  // Validate required fields
  if (!no || !status || !note || !price || !orderId || !action) {
    return res
      .status(400)
      .json({ message: "Please fill in all required fields." });
  }

  const newOrder = new FedexOrder({
    no,
    status,
    note,
    price,
    orderId,
    action,
  });

  try {
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Error creating FedEx order:", error);
    res
      .status(400)
      .json({ message: "Error creating order", error: error.message });
  }
});

// Delete a FedEx order by ID
router.delete("deleteorder/:id", async (req, res) => {
  try {
    const order = await FedexOrder.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "FedEx order not found." });
    }
    res.json({ message: "FedEx order deleted successfully." });
  } catch (error) {
    console.error("Error deleting FedEx order:", error);
    res.status(500).json({ message: "Server error." });
  }
});

// Update a FedEx order by ID
router.put("/:id", async (req, res) => {
  const { no, status, note, price, orderId, action } = req.body;

  // Validate required fields
  if (!no || !status || !note || !price || !orderId || !action) {
    return res
      .status(400)
      .json({ message: "Please fill in all required fields." });
  }

  try {
    const updatedOrder = await FedexOrder.findByIdAndUpdate(
      req.params.id,
      { no, status, note, price, orderId, action },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "FedEx order not found." });
    }

    res.json(updatedOrder);
  } catch (error) {
    console.error("Error updating FedEx order:", error);
    res
      .status(400)
      .json({ message: "Error updating order", error: error.message });
  }
});

// Get a single FedEx order by ID
// router.get("/:id", async (req, res) => {
//   try {
//     const order = await FedexOrder.findById(req.params.id);
//     if (!order) {
//       return res.status(404).json({ message: "FedEx order not found." });
//     }
//     res.json(order);
//   } catch (error) {
//     console.error("Error fetching FedEx order:", error);
//     res.status(500).json({ message: "Server error." });
//   }
// });

module.exports = router;
