const mongoose = require("mongoose");

const fedexOrderSchema = new mongoose.Schema({
    no: { type: Number  },
    status: { type: String  },
    note: { type: String },
    createdAt: { type: Date, default: Date.now },
    price: { type: String, required: true },
    orderId: { type: Number, required: true },
    action: { type: String },
    senderAddress: { type: mongoose.Schema.Types.ObjectId, ref: "FedexAddress", required: true },
    receiverAddress: { type: mongoose.Schema.Types.ObjectId, ref: "FedexAddress", required: true },
});

module.exports = mongoose.model("FedexOrder", fedexOrderSchema);
