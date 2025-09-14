
const ragLlmService = require('../services/ragLlmService');
const mongoQueryService = require('../services/mongoQueryService');
const { validationResult } = require('express-validator');

class QueryController {
  async translateAndExecute(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { question } = req.body;

      // Step 1: Translate natural language to MongoDB query
      const translationResult = await ragLlmService.translateQuery(question);
      
      let mongoQuery;
      try {
        mongoQuery = JSON.parse(translationResult.mongo_query);
      } catch (parseError) {
        return res.status(400).json({
          success: false,
          error: 'Invalid MongoDB query generated',
          generated_query: translationResult.mongo_query
        });
      }

      // Step 2: Execute MongoDB query
      const queryResult = await mongoQueryService.executeQuery('argo', mongoQuery);

      res.json({
        success: true,
        original_question: question,
        generated_query: mongoQuery,
        result_count: queryResult.length,
        results: queryResult.slice(0, 100) // Limit results to first 100
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async explainQuery(req, res) {
    try {
      const { question } = req.body;

      // Just translate without executing
      const translationResult = await ragLlmService.translateQuery(question);

      res.json({
        success: true,
        original_question: question,
        generated_query: translationResult.mongo_query,
        explanation: 'This MongoDB query was generated from your natural language question.'
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new QueryController();

