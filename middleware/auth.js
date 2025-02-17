const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, 'your_secret_key');
    req.user = decoded; // Attach the decoded user to the request object
    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to authenticate token' });
  }
};

module.exports = authMiddleware;
