const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const jwtAuth = require('../middleware/jwtAuth');
const validation = require('../middleware/validation');

// All user routes require authentication
router.use(jwtAuth);

router.put('/profile', validation.updateProfile, userController.updateProfile);
router.put('/password', validation.changePassword, userController.changePassword);
router.delete('/account', userController.deactivateAccount);

module.exports = router;
