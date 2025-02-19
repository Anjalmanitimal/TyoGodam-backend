// middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(" ")[1]; // Get token from Authorization header
  
  if (!token) {
    return res.status(403).send("No token provided");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token using secret
    req.user = decoded; // Attach the user info (decoded token) to the request
    next();
  } catch (error) {
    return res.status(403).send("Invalid or expired token");
  }
};
