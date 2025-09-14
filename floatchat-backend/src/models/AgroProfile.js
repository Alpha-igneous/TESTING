const mongoose = require('mongoose');

const argoProfileSchema = new mongoose.Schema({
  FLOAT_ID: { type: Number, required: true },
  CYCLE_NUMBER: { type: Number, required: true },
  LATITUDE: { type: Number, required: true },
  LONGITUDE: { type: Number, required: true },
  TEMP: { type: Number },
  PSAL: { type: Number },
  PRES: { type: Number },
  TIME: { type: Date },
  DATA_MODE: String,
  DIRECTION: String,
  PRES_ERROR: Number,
  PRES_QC: Number,
  PSAL_ERROR: Number, 
  PSAL_QC: Number,
  TEMP_ERROR: Number,
  TEMP_QC: Number,
  TIME_QC: Number,
  PLATFORM_NUMBER: String
}, {
  collection: 'argo', // Use same collection name as Python service expects
  timestamps: true
});

// Indexes for query performance
argoProfileSchema.index({ FLOAT_ID: 1, CYCLE_NUMBER: 1 });
argoProfileSchema.index({ LATITUDE: 1, LONGITUDE: 1 });
argoProfileSchema.index({ TIME: 1 });
argoProfileSchema.index({ TEMP: 1 });
argoProfileSchema.index({ PSAL: 1 });

module.exports = mongoose.model('ArgoProfile', argoProfileSchema);

