const axios = require('axios');
const ragLlmConfig = require('../config/ragLlm');
const logger = require('../config/logger');

class RagLlmService {
  constructor() {
    this.client = axios.create({
      baseURL: ragLlmConfig.baseUrl,
      timeout: ragLlmConfig.timeout,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Add request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        logger.info(`RAG-LLM Request: ${config.method.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        logger.error('RAG-LLM Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor for logging
    this.client.interceptors.response.use(
      (response) => {
        logger.info(`RAG-LLM Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        logger.error('RAG-LLM Response Error:', error.message);
        return Promise.reject(error);
      }
    );
  }

  async askQuestion(question, userId) {
    try {
      const response = await this.client.post('/chat', {
        question: question,
        userId: userId
      });
      
      return {
        success: true,
        answer: response.data.answer || '',
        sources: response.data.sources || [],
        data_points: response.data.data_points || []
      };
    } catch (error) {
      if (error.response) {
        throw new Error(`RAG-LLM API Error: ${error.response.status} - ${error.response.data?.error || 'Unknown error'}`);
      }
      if (error.request) {
        throw new Error('RAG-LLM service is not reachable. Please ensure the Python service is running on port 5001.');
      }
      throw new Error(`RAG-LLM service error: ${error.message}`);
    }
  }

  async simulateChain(query) {
    try {
      const response = await this.client.post('/simulate_chain', {
        query: query
      });
      
      return {
        success: true,
        result: response.data.result
      };
    } catch (error) {
      if (error.response) {
        throw new Error(`Chain simulation error: ${error.response.status} - ${error.response.data?.error || 'Unknown error'}`);
      }
      throw new Error(`Chain simulation failed: ${error.message}`);
    }
  }

  async translateQuery(question) {
    try {
      const response = await this.client.post('/translate_query', {
        question: question
      });
      
      return {
        success: true,
        mongo_query: response.data.mongo_query
      };
    } catch (error) {
      if (error.response) {
        throw new Error(`Query translation error: ${error.response.status} - ${error.response.data?.error || 'Unknown error'}`);
      }
      throw new Error(`Query translation failed: ${error.message}`);
    }
  }


  async getServiceInfo() {
    try {
      const response = await this.client.get('/');
      return response.data;
    } catch (error) {
      return { status: 'unknown', error: error.message };
    }
  }
}

module.exports = new RagLlmService();
