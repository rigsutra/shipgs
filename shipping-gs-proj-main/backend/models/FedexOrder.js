const mongoose = require('mongoose');

const fedexOrderSchema = new mongoose.Schema({
    no: { type: Number, required: true },
    status: { type: String, required: true },
    note: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    price: { type: String, required: true },
    orderId: { type: Number, required: true },
    action: { type: String, required: true },
});

module.exports = mongoose.model('FedexOrder', fedexOrderSchema);