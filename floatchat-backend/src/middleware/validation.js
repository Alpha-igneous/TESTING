const { body, query, param } = require('express-validator');

const validation = {
  // User Registration Validation
  register: [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
      .matches(/[a-z]/)
      .withMessage('Password must contain at least one lowercase letter')
      .matches(/[A-Z]/)
      .withMessage('Password must contain at least one uppercase letter')
      .matches(/\d/)
      .withMessage('Password must contain at least one number'),
    body('firstName')
      .trim()
      .notEmpty()
      .withMessage('First name is required'),
    body('lastName')
      .trim()
      .notEmpty()
      .withMessage('Last name is required')
  ],

  // User Login Validation
  login: [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ],

  // Chat Message Validation
  chatMessage: [
    body('question')
      .trim()
      .notEmpty()
      .withMessage('Question is required'),
    body('sessionId')
      .optional()
      .isString()
      .withMessage('Session ID must be a string')
      .isLength({ max: 100 })
      .withMessage('Session ID max length is 100 characters')
  ],

  // User Profile Update Validation
  updateProfile: [
    body('firstName')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('First name cannot be empty'),
    body('lastName')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Last name cannot be empty'),
    body('profileImageUrl')
      .optional()
      .isURL()
      .withMessage('Profile image must be a valid URL')
      .matches(/^https:\/\/images\.unsplash\.com\//)
      .withMessage('Profile image URL must be from Unsplash')
  ],

  // Password Change Validation
  changePassword: [
    body('currentPassword')
      .notEmpty()
      .withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 6 })
      .withMessage('New password must be at least 6 characters long')
      .matches(/[a-z]/)
      .withMessage('New password must contain at least one lowercase letter')
      .matches(/[A-Z]/)
      .withMessage('New password must contain at least one uppercase letter')
      .matches(/\d/)
      .withMessage('New password must contain at least one number')
  ],

  // Image Search Validation
  imageSearch: [
    query('query')
      .notEmpty()
      .withMessage('Search query is required'),
    query('perPage')
      .optional()
      .isInt({ min: 1, max: 50 })
      .withMessage('Per page must be an integer between 1 and 50'),
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be an integer greater than 0')
  ],

  // MongoDB Object ID validation (for route params)
  objectIdParam: [
    param('id')
      .isMongoId()
      .withMessage('Invalid ID format')
  ],

  // Chat history query param validation
  chatHistory: [
    query('sessionId')
      .optional()
      .isString()
      .withMessage('Session ID must be a string')
      .isLength({ max: 100 })
      .withMessage('Session ID max length is 100 characters'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be an integer between 1 and 100'),
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be an integer greater than 0')
  ]
};

module.exports = validation;
