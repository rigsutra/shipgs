const mongoose = require("mongoose");

const balanceSchema = new mongoose.Schema({
  amount: {
    type: Number,
    default: 0.0,
  },
});

module.exports = mongoose.model("Balance", balanceSchema);
