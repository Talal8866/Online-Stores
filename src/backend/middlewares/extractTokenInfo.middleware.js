const jwt = require('jsonwebtoken');

// Middleware to extract user/shop info if token exists
const extractTokenInfo = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { id: decoded.id, type: decoded.type };
    } catch (error) {
      console.error('Token verification failed:', error);
    }
  }

  next();
};

module.exports = extractTokenInfo;
