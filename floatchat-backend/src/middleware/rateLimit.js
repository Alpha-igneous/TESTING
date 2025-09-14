const rateLimit = require('express-rate-limit');
const constants = require('../utils/constants');

// General rate limiter
const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || constants.RATE_LIMIT.DEFAULT_WINDOW_MS,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || constants.RATE_LIMIT.DEFAULT_MAX_REQUESTS,
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.',
    statusCode: constants.HTTP_STATUS.TOO_MANY_REQUESTS
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth rate limiter (stricter for login attempts)
const authLimiter = rateLimit({
  windowMs: constants.RATE_LIMIT.AUTH_WINDOW_MS,
  max: constants.RATE_LIMIT.AUTH_MAX_REQUESTS,
  message: {
    success: false,
    error: 'Too many login attempts, please try again later.',
    statusCode: constants.HTTP_STATUS.TOO_MANY_REQUESTS
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
});

// Chat rate limiter (for AI interactions)
const chatLimiter = rateLimit({
  windowMs: constants.RATE_LIMIT.CHAT_WINDOW_MS,
  max: constants.RATE_LIMIT.CHAT_MAX_REQUESTS,
  message: {
    success: false,
    error: 'Too many chat requests, please slow down.',
    statusCode: constants.HTTP_STATUS.TOO_MANY_REQUESTS
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Default export for general use in app.js
module.exports = generalLimiter;

// Named exports for specific use cases
module.exports.general = generalLimiter;
module.exports.auth = authLimiter;
module.exports.chat = chatLimiter;
