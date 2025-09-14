const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const jwtAuth = require('../middleware/jwtAuth');
const validation = require('../middleware/validation');

// Public routes
router.post('/register', validation.register, authController.register);
router.post('/login', validation.login, authController.login);

// Protected routes
router.post('/logout', jwtAuth, authController.logout);
router.get('/profile', jwtAuth, authController.getProfile);

module.exports = router;
