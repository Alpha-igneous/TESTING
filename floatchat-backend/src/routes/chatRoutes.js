
const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const jwtAuth = require('../middleware/jwtAuth');
const { body } = require('express-validator');

// Chat with RAG-LLM service
router.post('/message', 
  jwtAuth,
  [
    body('question').notEmpty().withMessage('Question is required'),
    body('sessionId').optional().isString()
  ],
  chatController.sendMessage
);

// Chain simulation
router.post('/simulate',
  jwtAuth,
  [
    body('query').notEmpty().withMessage('Query is required')
  ],
  chatController.simulateChain
);

// Chat history
router.get('/history',
  jwtAuth,
  chatController.getChatHistory
);

module.exports = router;

