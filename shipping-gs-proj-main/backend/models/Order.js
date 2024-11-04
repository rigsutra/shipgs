const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    order_type: { type: String, required: true },
    weight: { type: Number, required: true },
    template: { type: String, default: null },
    total_price: { type: Number, required: true },
    fromAddress: {
      name: { type: String, required: true },
      company_name: { type: String, default: null },
      street1: { type: String, required: true },
      street2: { type: String, default: null },
      zip_code: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
    },
    toAddress: {
      name: { type: String, required: true },
      company_name: { type: String, default: null },
      street1: { type: String, required: true },
      street2: { type: String, default: null },
      zip_code: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
    },
  },
  { timestamps: true }
); // Enable timestamps

module.exports = mongoose.model("Order", orderSchema);
