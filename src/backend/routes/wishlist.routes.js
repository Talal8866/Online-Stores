const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlist.controller');
const authenticateToken = require('../middlewares/auth.middleware');

// Add/Remove Product To/From Wishlist
router.post('/', authenticateToken, wishlistController.wishlistProduct);

// Get Wishlist
router.get('/wishlist', authenticateToken, wishlistController.getWishlist);

module.exports = router;
