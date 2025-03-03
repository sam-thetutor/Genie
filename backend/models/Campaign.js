const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  apiKey: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['active', 'paused'],
    default: 'active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Campaign', campaignSchema); 