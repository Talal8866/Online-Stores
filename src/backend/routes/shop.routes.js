const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shop.controller');
const authenticateToken = require('../middlewares/auth.middleware');
const userTypeValidator = require('../middlewares/userTypeValidator.middleware');
const upload = require('../middlewares/upload.middleware');

// Shops Registration
router.post('/register', upload.single('logo'), shopController.registerShop);

// Shops Login
router.post('/login', shopController.loginShop);

// Shops Logout
router.post('/logout', authenticateToken, shopController.logoutShop);

// Get Shops List
router.get('/', shopController.getAllShops);

// Rate Shop
router.post('/rate', authenticateToken, shopController.rateShop);

// Get Current Shop Profile
router.get('/profile', authenticateToken, userTypeValidator('shop'), shopController.getShopProfile);

// Update Shop Info
router.patch('/profile/update', authenticateToken, shopController.updateProfile);

// Change Shop Password
router.post('/profile/change-password', authenticateToken, shopController.changePassword);

// Upload Shop Logo
router.post('/profile/logo', authenticateToken, upload.single('logo'), shopController.uploadLogo);

// Update Shop Description
router.patch('/profile/description', authenticateToken, shopController.updateDescription);

//Get Featured Shops
router.get('/featured', shopController.getFeaturedShops);

// Get Public Shop Profile
router.get('/:shopId', shopController.getPublicProfile);

// Get Shops By Category
router.get('/categories/:category', shopController.getShopsByCategory);

module.exports = router;
