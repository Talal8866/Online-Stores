const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Shop = require('../models/shop.model');

// Middleware to Authenticate Token and Validate Token Version
const authenticateToken = async (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied, token missing.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { type, id, version } = decoded;

    const userOrShop =
      type === 'user' ? await User.findById(id) : await Shop.findById(id);
    if (!userOrShop || userOrShop.tokenVersion !== version) {
      return res.status(401).json({ message: 'Invalid token or token version mismatch.' });
    }

    req.user = { id: userOrShop._id, type };

    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = authenticateToken;
