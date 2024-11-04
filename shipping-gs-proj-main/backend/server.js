const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const bodyParser = require("body-parser");
const addressRoutes = require("./routes/addresses");
const orderRoutes = require("./routes/orders");
const paymentRoutes = require("./routes/payment");
const fedexOrderRoutes = require("./routes/fedexOrders"); // Corrected import
const faqRoutes = require("./routes/faq");
const DepositRoutes = require("./routes/depositRoutes"); // Corrected import

dotenv.config();
connectDB();

const app = express();

// CORS configuration
const allowedOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json());

// Use routes
app.use("/api", authRoutes);
app.use("/api", addressRoutes);
app.use("/api", orderRoutes);
app.use("/api/", fedexOrderRoutes); // Prefix route to distinguish resources
app.use("/api", paymentRoutes);
app.use("/api", faqRoutes);
app.use("/api", DepositRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
