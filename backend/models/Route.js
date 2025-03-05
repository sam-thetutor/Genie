const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  principal: {
    type: String,
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  platform: {
    type: String,
    enum: ['telegram', 'discord', 'twitter'],
    required: true
  },
  sourceId: {
    type: String,
    required: true
  },
  openchatApiKey: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'paused'],
    default: 'active'
  },
  filters: {
    includeText: Boolean,
    includeImages: Boolean,
    includeLinks: Boolean,
    keywords: [String]
  },
  lastSync: Date,
  errorCount: {
    type: Number,
    default: 0
  },
  lastError: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Route', routeSchema); 