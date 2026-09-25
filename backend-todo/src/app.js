const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const todoRoutes = require('./routes/todoRoutes');
const { notFoundHandler, errorHandler } = require('./middleware/errorMiddleware');
const { sendSuccess } = require('./utils/responseHandler');

const app = express();

// Configure CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim()).filter(Boolean)
  : ['http://localhost:3000', 'http://127.0.0.1:3000'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, postman) or matching allowed origins
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS policy'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  return sendSuccess(res, 200, 'Todo API is running');
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

// 404 Route Not Found Handler
app.use(notFoundHandler);

// Centralized Error Handler
app.use(errorHandler);

module.exports = app;
