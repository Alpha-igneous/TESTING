const ragLlmService = require('./ragLlmService');
const logger = require('../config/logger');

class SimulatorService {
  async runChainSimulation(query) {
    try {
      // This proxies to the Python RAG-LLM simulator endpoint
      const result = await ragLlmService.simulateChain(query);
      
      logger.info(`Chain simulation completed for query: ${query.substring(0, 50)}...`);
      
      return {
        success: true,
        query: query,
        result: result.result,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Chain simulation error:', error);
      throw new Error(`Chain simulation failed: ${error.message}`);
    }
  }

  async validateSimulationQuery(query) {
    // Basic validation for simulation queries
    if (!query || typeof query !== 'string') {
      throw new Error('Query must be a non-empty string');
    }
    
    if (query.length < 5) {
      throw new Error('Query must be at least 5 characters long');
    }
    
    if (query.length > 500) {
      throw new Error('Query must be less than 500 characters');
    }
    
    return true;
  }
}

module.exports = new SimulatorService();
