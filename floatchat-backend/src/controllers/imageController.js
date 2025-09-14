const imageService = require('../services/imageService');
const userService = require('../services/userService');
const { validationResult } = require('express-validator');
const logger = require('../config/logger');

class ImageController {
  async searchImages(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { query, perPage = 20, page = 1 } = req.query;
      
      const result = await imageService.searchImages(query, parseInt(perPage), parseInt(page));
      
      res.json({
        success: true,
        data: {
          images: result.images,
          pagination: {
            page: parseInt(page),
            perPage: parseInt(perPage),
            total: result.total,
            totalPages: result.totalPages
          }
        }
      });

    } catch (error) {
      logger.error('Image search error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async setProfileImage(req, res) {
    try {
      const { imageUrl } = req.body;
      const userId = req.user.userId;

      if (!imageUrl) {
        return res.status(400).json({
          success: false,
          error: 'Image URL is required'
        });
      }

      // Validate Unsplash URL
      if (!imageService.validateUnsplashUrl(imageUrl)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid Unsplash image URL'
        });
      }

      // Update user profile with new image URL
      const user = await userService.updateProfile(userId, { profileImageUrl: imageUrl });

      logger.info(`Profile image updated for user: ${userId}`);

      res.json({
        success: true,
        message: 'Profile image updated successfully',
        data: { 
          profileImageUrl: user.profileImageUrl,
          user: user
        }
      });

    } catch (error) {
      logger.error('Set profile image error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getImageById(req, res) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          error: 'Image ID is required'
        });
      }

      const image = await imageService.getImageById(id);

      res.json({
        success: true,
        data: { image }
      });

    } catch (error) {
      logger.error('Get image by ID error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new ImageController();
