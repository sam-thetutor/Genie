const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Connect to database
connectDB();

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

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 