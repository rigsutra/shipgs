const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};

const authorize = (role) => (req, res, next) => {
  if (req.userRole !== role) {
    return res.status(403).json({ success: false, message: "Access denied" });
  }
  next();
};

module.exports = { authMiddleware, authorize };
