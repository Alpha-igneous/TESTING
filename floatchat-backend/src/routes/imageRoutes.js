const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');
const jwtAuth = require('../middleware/jwtAuth');
const validation = require('../middleware/validation');

// All routes require authentication
router.use(jwtAuth);

router.get('/search', validation.imageSearch, imageController.searchImages);
router.post('/profile', imageController.setProfileImage);
router.get('/:id', imageController.getImageById);

module.exports = router;
