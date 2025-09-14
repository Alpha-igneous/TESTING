const express = require('express');
const router = express.Router();
const queryController = require('../controllers/queryController');
const jwtAuth = require('../middleware/jwtAuth');
const { body } = require('express-validator');

// Natural language to MongoDB query
router.post('/translate',
  jwtAuth,
  [
    body('question').notEmpty().withMessage('Question is required')
  ],
  queryController.translateAndExecute
);

// Explain query translation
router.post('/explain',
  jwtAuth,
  [
    body('question').notEmpty().withMessage('Question is required')
  ],
  queryController.explainQuery
);

module.exports = router;

