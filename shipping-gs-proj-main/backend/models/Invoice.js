const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ["Crypto"], // Add more payment methods as needed
  },
  status: {
    type: String,
    required: true,
    enum: ["Pending", "Expired", "Paid"],
    default: "Pending",
  },
});

module.exports = mongoose.model("Invoice", invoiceSchema);
