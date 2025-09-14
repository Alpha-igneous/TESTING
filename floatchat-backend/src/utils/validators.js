const { body, query, param } = require('express-validator');

const validators = {
  // Authentication validators
  register: [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
    body('firstName')
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('First name is required and must be less than 50 characters'),
    body('lastName')
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('Last name is required and must be less than 50 characters')
  ],

  login: [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address'),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ],

  // Chat validators
  chatMessage: [
    body('question')
      .trim()
      .isLength({ min: 1, max: 1000 })
      .withMessage('Question is required and must be less than 1000 characters'),
    body('sessionId')
      .optional()
      .isString()
      .isLength({ max: 100 })
      .withMessage('Session ID must be a string with max 100 characters')
  ],

  chainSimulation: [
    body('query')
      .trim()
      .isLength({ min: 1, max: 500 })
      .withMessage('Query is required and must be less than 500 characters')
  ],

  queryTranslation: [
    body('question')
      .trim()
      .isLength({ min: 1, max: 1000 })
      .withMessage('Question is required and must be less than 1000 characters')
  ],

  // User profile validators
  updateProfile: [
    body('firstName')
      .optional()
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('First name must be between 1 and 50 characters'),
    body('lastName')
      .optional()
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('Last name must be between 1 and 50 characters'),
    body('profileImageUrl')
      .optional()
      .isURL()
      .withMessage('Profile image must be a valid URL')
      .matches(/^https:\/\/images\.unsplash\.com\//)
      .withMessage('Profile image must be from Unsplash'),
    body('preferences.theme')
      .optional()
      .isIn(['light', 'dark', 'ocean'])
      .withMessage('Theme must be light, dark, or ocean'),
    body('preferences.notifications')
      .optional()
      .isBoolean()
      .withMessage('Notifications must be a boolean')
  ],

  changePassword: [
    body('currentPassword')
      .notEmpty()
      .withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 6 })
      .withMessage('New password must be at least 6 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('New password must contain at least one lowercase letter, one uppercase letter, and one number')
  ],

  // Image validators
  imageSearch: [
    query('query')
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Search query is required and must be less than 100 characters'),
    query('perPage')
      .optional()
      .isInt({ min: 1, max: 50 })
      .withMessage('Per page must be between 1 and 50'),
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer')
  ],

  setProfileImage: [
    body('imageUrl')
      .isURL()
      .withMessage('Image URL is required and must be valid')
      .matches(/^https:\/\/images\.unsplash\.com\//)
      .withMessage('Image URL must be from Unsplash')
  ],

  // Parameter validators
  mongoObjectId: [
    param('id')
      .isMongoId()
      .withMessage('Invalid ID format')
  ],

  // Chat history validators
  chatHistory: [
    query('sessionId')
      .optional()
      .isString()
      .isLength({ max: 100 })
      .withMessage('Session ID must be a string with max 100 characters'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer')
  ]
};

module.exports = validators;
