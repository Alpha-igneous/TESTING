
const ragLlmService = require('../services/ragLlmService');
const ChatSession = require('../models/ChatSession');
const { validationResult } = require('express-validator');

class ChatController {
  async sendMessage(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { question, sessionId = 'default' } = req.body;
      const userId = req.user.userId;

      // Call Python RAG-LLM service
      const ragResponse = await ragLlmService.askQuestion(question, userId);

      // Save chat session to MongoDB
      await ChatSession.findOneAndUpdate(
        { userId, sessionId },
        {
          $push: {
            messages: [
              {
                role: 'user',
                content: question,
                timestamp: new Date()
              },
              {
                role: 'assistant', 
                content: ragResponse.answer,
                timestamp: new Date(),
                sources: ragResponse.sources,
                data_points: ragResponse.data_points
              }
            ]
          }
        },
        { upsert: true, new: true }
      );

      res.json({
        success: true,
        answer: ragResponse.answer,
        sources: ragResponse.sources,
        data_points: ragResponse.data_points,
        sessionId
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async simulateChain(req, res) {
    try {
      const { query } = req.body;
      
      if (!query) {
        return res.status(400).json({
          success: false,
          error: 'Query is required'
        });
      }

      const result = await ragLlmService.simulateChain(query);

      res.json({
        success: true,
        result: result.result
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getChatHistory(req, res) {
    try {
      const userId = req.user.userId;
      const { sessionId, limit = 50 } = req.query;

      const query = { userId };
      if (sessionId) query.sessionId = sessionId;

      const sessions = await ChatSession.find(query)
        .sort({ updatedAt: -1 })
        .limit(parseInt(limit));

      res.json({
        success: true,
        sessions
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new ChatController();
