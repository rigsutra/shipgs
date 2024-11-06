const express = require("express");
const router = express.Router();
const Invoice = require("../models/Invoice");
const Balance = require("../models/Balance");
const axios = require("axios");

// Route to get the current balance
router.get("/balance", async (req, res) => {
  try {
    let balance = await Balance.findOne();
    if (!balance) {
      balance = new Balance();
      await balance.save();
    }
    res.status(200).json({ balance: balance.amount });
  } catch (error) {
    res.status(500).json({ message: "Error fetching balance", error });
  }
});

// Route to get all invoices
router.get("/invoices", async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ date: -1 });
    res.status(200).json({ invoices });
  } catch (error) {
    res.status(500).json({ message: "Error fetching invoices", error });
  }
});

// Route to create a payment request (server-side)
router.post("/create-payment", async (req, res) => {
  try {
    const { amount } = req.body;
    const orderId = `order_${Date.now()}`;

    const paymentResponse = await axios.post(
      "https://api.nowpayments.io/v1/invoice",
      {
        price_amount: amount,
        price_currency: "USD",
        pay_currency: "BTC",
        order_id: orderId,
        order_description: "Balance top-up",
        success_url: "http://localhost:3000/success",
        cancel_url: "http://localhost:3000/cancel",
      },
      {
        headers: {
          "x-api-key": process.env.NOWPAYMENTS_API_KEY, // Secure the key in environment variables
        },
      }
    );

    // Save the invoice to the database
    const invoice = new Invoice({
      amount,
      paymentMethod: "Crypto",
      status: "Pending",
      orderId,
      invoiceUrl: paymentResponse.data.invoice_url,
    });
    await invoice.save();

    res.status(200).json({ invoiceUrl: paymentResponse.data.invoice_url });
  } catch (error) {
    console.error("Error creating payment with NOWPayments:", error);
    res.status(500).json({ message: "Failed to create payment", error });
  }
});

module.exports = router;
