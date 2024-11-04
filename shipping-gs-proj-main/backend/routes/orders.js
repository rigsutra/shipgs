const express = require("express");
const Order = require("../models/Order");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Fetch price based on order type (mock implementation)
router.post("/getPrices", (req, res) => {
  const prices = {
    "USPS Ground OZ": 10,
    "USPS Ground lb": 15,
    "USPS Priority": 20,
    "USPS Express": 30,
    "USPS Priority v2": 25,
  };

  const price = prices[req.body.type];

  if (price) {
    res.json({ price });
  } else {
    res.status(400).json({ message: "Invalid order type" });
  }
});

// POST /api/orders/normal - Create Normal Order
router.post("/orders/normal", async (req, res) => {
  const orderData = req.body;

  // Remove 'id' if present, as Mongoose handles _id automatically
  if (orderData.id) {
    delete orderData.id;
  }

  const newOrder = new Order(orderData);

  try {
    const savedOrder = await newOrder.save();
    res.status(201).json({ success: true, order: savedOrder });
  } catch (error) {
    console.error("Error creating normal order:", error);
    res.status(400).json({
      success: false,
      message: "Error creating normal order",
      error: error.message,
    });
  }
});

// POST /api/orders/quick - Create Quick Order
router.post("/orders/quick", async (req, res) => {
  const orderData = req.body;

  // Remove 'id' if present, as Mongoose handles _id automatically
  if (orderData.id) {
    delete orderData.id;
  }

  // Optionally, set a specific order_type for Quick Orders
  orderData.order_type = orderData.order_type || "Quick Order";

  const newOrder = new Order(orderData);

  try {
    const savedOrder = await newOrder.save();
    res.status(201).json({ success: true, order: savedOrder });
  } catch (error) {
    console.error("Error creating quick order:", error);
    res.status(400).json({
      success: false,
      message: "Error creating quick order",
      error: error.message,
    });
  }
});

// Get USPS Orders with pagination and sorting
router.get("/USPSOrders", async (req, res) => {
  // Changed from /getUSPSOrders to /usps
  const { page = 1, limit = 10, sort = "asc" } = req.query;

  try {
    const uspsOrders = await Order.find({ order_type: /USPS/ }) // Using regex to match all USPS types
      .sort({ createdAt: sort === "asc" ? 1 : -1 }) // Ensure 'createdAt' is in the schema
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const totalOrders = await Order.countDocuments({ order_type: /USPS/ });

    res.json({
      orders: uspsOrders,
      totalOrders,
      totalPages: Math.ceil(totalOrders / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error("Error fetching USPS orders:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
