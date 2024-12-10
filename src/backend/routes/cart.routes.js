const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const authenticateToken = require('../middlewares/auth.middleware');

// Add a product to the cart
router.post('/add', authenticateToken, cartController.addToCart);

// View the cart
router.get('/', authenticateToken, cartController.viewCart);

// Clear User's Cart (Checkout)
router.delete('/clear', authenticateToken, cartController.clearCart);

// Update product quantity in the cart
router.put('/update/:productId', authenticateToken, cartController.updateCartQuantity);

// Remove a product from the cart
router.delete('/remove/:productId', authenticateToken, cartController.removeFromCart);

module.exports = router;
