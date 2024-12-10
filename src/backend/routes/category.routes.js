const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');

// Get Categories
router.get('/', categoryController.getAllCategories);

// Gett Featured Categories
router.get('/featured', categoryController.getFeaturedCategories);

module.exports = router;
