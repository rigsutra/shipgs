const express = require("express");
const axios = require("axios");
// import mongoose from "mongoose";
const router = express.Router();
// import Order from "/orderModel.js";
// import Payment from "/paymentModel.js";
const cors = require("cors");

const crypto = require("crypto");
const db = require('../config/db');

const merchent = ""; //merchentId
const merchentApiKey = "";
const cryptomusUri = "https://api.cryptomus.com/v1"; //example: https://api.cryptomus.com/v1
const serverUri = ""; // uri of a deployed website
const clientUri = ""; 

router.post("/checkout", async (req, res, next) => {
    try {
        const { product } = req.body;

        //sanitizing
        if (!product?.name || !product?.amount) return next(new Error("invalid product"));

        //create a new order
        const query = 'INSERT INTO `orders` (product, amount) VALUES (?, ?);'; 
        db.query(query, [product.name, product.amount], (err, result) => { 
            if (err) {
                return next(err); 
            }
            // Successfully created the order
            res.json({ success: true, message: 'Order created successfully', orderId: result.insertId }); // Added orderId to response

            // create a new payment intent
            const payload = {
                amount: product.amount,
                currency: "usd",
                order_id: result.insertId, // Use the newly created order ID
                url_callback: `${serverUri}/payment/success`
            };

            const bufferData = Buffer.from(JSON.stringify(payload)).toString("base64").concat(merchentApiKey); // payload ka buffer data create kiya
            const sign = crypto.createHash("md5").update(bufferData).digest("hex"); // read docs of sign in cryptomus to create

            // const {data} = await axios.post(`${cryptomusUri}/payment`, payload, {
            //     headers: {
            //         merchent,
            //         sign,
            //         "Content-Type": "application/json"
            //     }
            // })
        });
    } catch (error) {
        next(error); // Catch any other errors
    }
});


router.post("/payment/success", async (req, res, next) => {
    const { sign, order_id, uuid, payer_currency, amount, payment_amount, currency, network } = req.body; // Correctly access req.body here

    //sanitizing
    if (!sign) return next(new Error("invalid request"));

    const data = JSON.parse(req.rawBody); // Corrected JSON parsing

    delete data.sign; // ye delete kyu kiya waise as we can see payload sarri info hai par sign nahi hai isliye humne data se sign delete kiya

    const bufferData = Buffer.from(JSON.stringify(data)).toString("base64").concat(merchentApiKey);  // payload buffer data created   

    const hash = crypto.createHash("md5").update(bufferData).digest("hex");

    //sanitizing
    if (hash !== sign) return next(new Error("invalid payment"));

    // Use the provided order_id to fetch the order
    const orderQuery = 'SELECT * FROM orders WHERE id = ?'; // Adjusted to match your DB schema
    db.query(orderQuery, [order_id], async (err, orderResults) => {
        if (err) return next(err); // Handle SQL errors

        if (orderResults.length === 0) return next(new Error("invalid order")); // Check if order exists

        // Now insert payment data into the payment table
        const paymentQuery = 'INSERT INTO payment (uuid, order_id, player_currency, payment_amount, amount, network, currency) VALUES (?, ?, ?, ?, ?, ?, ?);';
        
        db.query(paymentQuery, [uuid, order_id, payer_currency, payment_amount, amount, network, currency], async (err) => {
            if (err) return next(err); // Handle SQL errors
            
            // Successfully created the payment
            const order = orderResults[0]; // Get the order details from the query result

            order.payment_status = "paid"; // Update order payment status
            order.payment_info = uuid; // Assuming uuid is used to track the payment

            await new Promise((resolve, reject) => {
                const updateOrderQuery = 'UPDATE orders SET payment_status = ?, payment_info = ? WHERE id = ?';
                db.query(updateOrderQuery, [order.payment_status, order.payment_info, order.id], (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });

            res.redirect(clientUri); // Redirect to the client URI after payment is successful
        });
    });
});

// Error-handling middleware
router.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err); 
    }
    res.status(500).json({ message: err.message });
});

module.exports = router;
