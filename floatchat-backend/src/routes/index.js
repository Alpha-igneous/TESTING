const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Import all route modules
const authRoutes = require('./authRoutes');
const chatRoutes = require('./chatRoutes');
const userRoutes = require('./userRoutes');
const imageRoutes = require('./imageRoutes');
const queryRoutes = require('./queryRoutes');

// Mount routes
router.use('/api/auth', authRoutes);
router.use('/api/chat', chatRoutes);
router.use('/api/users', userRoutes);
router.use('/api/images', imageRoutes);
router.use('/api/query', queryRoutes);


// API info endpoint
router.get('/api', (req, res) => {
  res.json({
    name: 'FloatChat Backend API',
    version: '1.0.0',
    description: 'AI-Powered Conversational Interface for ARGO Ocean Data',
    endpoints: {
      auth: '/api/auth/*',
      chat: '/api/chat/*',
      users: '/api/users/*',
      images: '/api/images/*',
      query: '/api/query/*',
    },
    documentation: 'https://github.com/your-repo/floatchat-backend'
  });
});

// Root endpoint
router.get('/', (req, res) => {
  res.json({
    message: 'FloatChat Backend API is running',
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
