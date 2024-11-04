const express = require("express");
const router = express.Router();
const Invoice = require("../models/Invoice");
const Balance = require("../models/Balance");

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

// Route to add balance
router.post("/add-balance", async (req, res) => {
  try {
    const { amount } = req.body;

    let balance = await Balance.findOne();
    if (!balance) {
      balance = new Balance();
    }

    balance.amount += parseFloat(amount);
    await balance.save();

    // Create an invoice entry
    const invoice = new Invoice({
      amount: amount,
      paymentMethod: "Crypto",
      status: "Pending",
    });
    await invoice.save();

    res
      .status(200)
      .json({
        message: "Balance updated successfully",
        balance: balance.amount,
      });
  } catch (error) {
    res.status(500).json({ message: "Error updating balance", error });
  }
});

module.exports = router;
