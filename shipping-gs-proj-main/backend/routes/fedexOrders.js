// routes/fedexOrderRoutes.js

const express = require("express");
const FedexOrder = require("../models/FedexOrder");
const Address = require("../models/FedexAddress");
const authMiddleware = require("../middleware/authMiddleware"); // If routes are protected

const router = express.Router();

// Apply authentication middleware to all routes below (if needed)
// router.use(authMiddleware);

// Fetch all FedEx orders, including populated sender and receiver addresses
router.get("/getfedexorder", async (req, res) => {
  try {
    const orders = await FedexOrder.find()
      .populate("senderAddress receiverAddress")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching FedEx orders:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new FedEx order with separate address storage
router.post("/createfedexorder", async (req, res) => {
  const { no, status, note, price, orderId, action, senderAddress, receiverAddress } = req.body;

  if (!no || !status || !note || !price || !orderId || !action) {
    return res.status(400).json({ message: "Please fill in all required fields for the order." });
  }

  try {
    const sender = await Address.findOneAndUpdate(
      { ...senderAddress },
      { ...senderAddress },
      { new: true, upsert: true }
    );

    const receiver = await Address.findOneAndUpdate(
      { ...receiverAddress },
      { ...receiverAddress },
      { new: true, upsert: true }
    );

    const newOrder = new FedexOrder({
      no,
      status,
      note,
      price,
      orderId,
      action,
      senderAddress: sender._id,
      receiverAddress: receiver._id,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Error creating FedEx order:", error);
    res.status(400).json({ message: "Error creating order", error: error.message });
  }
});

// Delete a FedEx order by ID
router.delete("/deleteorder/:id", async (req, res) => {
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
  const { no, status, note, price, orderId, action, senderAddress, receiverAddress } = req.body;

  if (!no || !status || !note || !price || !orderId || !action) {
    return res.status(400).json({ message: "Please fill in all required fields for the order." });
  }

  try {
    const sender = await Address.findOneAndUpdate(
      { ...senderAddress },
      { ...senderAddress },
      { new: true, upsert: true }
    );

    const receiver = await Address.findOneAndUpdate(
      { ...receiverAddress },
      { ...receiverAddress },
      { new: true, upsert: true }
    );

    const updatedOrder = await FedexOrder.findByIdAndUpdate(
      req.params.id,
      {
        no,
        status,
        note,
        price,
        orderId,
        action,
        senderAddress: sender._id,
        receiverAddress: receiver._id,
      },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "FedEx order not found." });
    }

    res.json(updatedOrder);
  } catch (error) {
    console.error("Error updating FedEx order:", error);
    res.status(400).json({ message: "Error updating order", error: error.message });
  }
});

// Get a single FedEx order by ID, with populated addresses
router.get("/:id", async (req, res) => {
  try {
    const order = await FedexOrder.findById(req.params.id).populate("senderAddress receiverAddress");
    if (!order) {
      return res.status(404).json({ message: "FedEx order not found." });
    }
    res.json(order);
  } catch (error) {
    console.error("Error fetching FedEx order:", error);
    res.status(500).json({ message: "Server error." });
  }
});

// --- New Routes for Managing Addresses ---

// Fetch all addresses
router.get("/Fedexaddresses", async (req, res) => {
  try {
    const addresses = await Address.find();
    res.json(addresses);
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Fetch a single address by ID
router.get("/Fedexaddresses/:id", async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);
    if (!address) {
      return res.status(404).json({ message: "Address not found." });
    }
    res.json(address);
  } catch (error) {
    console.error("Error fetching address:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add this route to create or update a FedEx address
router.post("/createFedexaddresses", async (req, res) => {
  const addressData = req.body;

  try {
    // Check if an address with the same details exists
    const existingAddress = await Address.findOne(addressData);

    if (existingAddress) {
      return res.json(existingAddress); // Return the existing address if found
    }

    // If address doesn't exist, create a new one
    const newAddress = new Address(addressData);
    const savedAddress = await newAddress.save();
    res.status(201).json(savedAddress);
  } catch (error) {
    console.error("Error creating or retrieving address:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


module.exports = router;
