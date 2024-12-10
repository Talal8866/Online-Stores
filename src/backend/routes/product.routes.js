const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const authenticateToken = require('../middlewares/auth.middleware');
const tokenInfo = require('../middlewares/extractTokenInfo.middleware');
const upload = require('../middlewares/upload.middleware');

// Add or Update Product
router.post('/', authenticateToken, upload.single('picture'), productController.addOrUpdateProduct);

// Get Featured Products
router.get('/featured', productController.getFeaturedProducts);

// Get All Products
router.get('/all', productController.getAllProducts);

// Delete Current Product
router.delete('/delete/:productId', authenticateToken, productController.deleteProduct);

// Get Current Product Details
router.get('/get/:productId', tokenInfo, productController.getProductDetails);

// Get Products By Category
router.get('/list/:category', productController.getProductsByCategory);

module.exports = router;
