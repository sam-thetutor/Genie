const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const contentScheduler = require('./services/contentScheduler');
const telegramBot = require('./services/telegramBot');
const discordBot = require('./services/discordBot');
const twitterBot = require('./services/twitterBot');

const app = express();

// Connect to database
connectDB();

// Start content scheduler
contentScheduler.start();

// Middleware
app.use(cors({
  origin: 'http://localhost:5174', // Vite's default port
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
app.use(helmet());
app.use(express.json());

// Routes
app.use('/api/campaigns', require('./routes/campaignRoutes'));
app.use('/api/contents', require('./routes/contentRoutes'));
app.use('/api', require('./routes/aiRoutes'));
app.use('/api/routes', require('./routes/routeRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));


// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling
app.use(errorHandler);

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  contentScheduler.stop();
  telegramBot.stop();
  discordBot.stop();
  twitterBot.stop();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  contentScheduler.stop();
  process.exit(0);
});

// telegramBot.start();
discordBot.start();
// twitterBot.start();
const PORT = process.env.PORT || 6000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));