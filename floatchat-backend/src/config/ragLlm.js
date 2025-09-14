
module.exports = {
  baseUrl: process.env.RAG_LLM_BASE_URL || 'http://localhost:5001',
  timeout: parseInt(process.env.RAG_LLM_TIMEOUT) || 30000,
  endpoints: {
    chat: '/chat',
    simulate: '/simulate_chain', 
    translate: '/translate_query'
  }
};
