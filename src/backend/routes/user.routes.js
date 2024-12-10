const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authenticateToken = require('../middlewares/auth.middleware');
const userTypeValidator = require('../middlewares/userTypeValidator.middleware');

// Users Registration
router.post('/register', userController.registerUser);

// Users Login
router.post('/login', userController.loginUser);

// Users Logout
router.post('/logout', authenticateToken, userController.logoutUser);

// Get Current User Profile
router.get('/profile', authenticateToken, userTypeValidator('user'), userController.getUserProfile);

// Update Shop Info
router.patch('/profile/update', authenticateToken, userController.updateProfile);

// Change Shop Password
router.post('/profile/change-password', authenticateToken, userController.changePassword);

// Get Public User Profile
router.get('/:userId', userController.getPublicProfile);


module.exports = router;
