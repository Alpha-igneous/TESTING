const userService = require('../services/userService');
const { validationResult } = require('express-validator');
const logger = require('../config/logger');

class UserController {
  async updateProfile(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const userId = req.user.userId;
      const user = await userService.updateProfile(userId, req.body);

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: { user }
      });

    } catch (error) {
      logger.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async changePassword(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { currentPassword, newPassword } = req.body;
      const userId = req.user.userId;

      await userService.changePassword(userId, currentPassword, newPassword);

      res.json({
        success: true,
        message: 'Password changed successfully'
      });

    } catch (error) {
      logger.error('Change password error:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async deactivateAccount(req, res) {
    try {
      const userId = req.user.userId;
      await userService.deactivateAccount(userId);

      res.json({
        success: true,
        message: 'Account deactivated successfully'
      });

    } catch (error) {
      logger.error('Deactivate account error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new UserController();
