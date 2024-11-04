// models/Address.js

const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  name: { type: String, required: true },
  street: { type: String, required: true },
  street2: { type: String, default: "" },
  zip: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Address", addressSchema);
