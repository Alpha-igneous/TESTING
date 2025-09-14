
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: { 
    type: String, 
    enum: ['user', 'assistant'], 
    required: true 
  },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  sources: [String],
  data_points: [{
    cycle: Number,
    temp: Number,
    salinity: Number,
    pressure: Number,
    latitude: Number,
    longitude: Number,
    date: String
  }]
});

const chatSessionSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  sessionId: { type: String, required: true },
  messages: [messageSchema],
  lastActivity: { type: Date, default: Date.now }
}, {
  timestamps: true
});

chatSessionSchema.index({ userId: 1, sessionId: 1 });

module.exports = mongoose.model('ChatSession', chatSessionSchema);

