const { sendError } = require('../utils/responseHandler');

/**
 * 404 Not Found Middleware for unhandled routes
 */
const notFoundHandler = (req, res) => {
  return sendError(res, 404, `Route not found: ${req.method} ${req.originalUrl}`);
};

/**
 * Centralized error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  // Log server error details internally (never expose internals to client in production)
  console.error('[Error caught in errorMiddleware]:', {
    message: err.message,
    code: err.code,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });

  // Handle Postgres / Supabase unique violation (23505)
  if (err.code === '23505') {
    return sendError(res, 409, 'A record with this unique identifier already exists.');
  }

  // Handle Postgres invalid UUID format (22P02)
  if (err.code === '22P02') {
    return sendError(res, 400, 'Invalid ID format provided.');
  }

  // Handle missing or invalid Supabase API Key
  if (err.message === 'Invalid API key' || err.message?.includes('API key')) {
    return sendError(
      res,
      500,
      'Supabase configuration error: SUPABASE_SERVICE_ROLE_KEY is missing or invalid in backend-todo/.env. Please paste your Supabase service_role key into backend-todo/.env.'
    );
  }

  // Handle known HTTP errors with custom status codes
  if (err.statusCode) {
    return sendError(res, err.statusCode, err.message, err.errors);
  }

  // Handle JWT validation errors
  if (err.name === 'JsonWebTokenError') {
    return sendError(res, 401, 'Invalid authentication token.');
  }
  if (err.name === 'TokenExpiredError') {
    return sendError(res, 401, 'Authentication token has expired.');
  }

  // Default internal server error
  const message = process.env.NODE_ENV === 'production'
    ? 'An unexpected internal server error occurred.'
    : err.message || 'Internal Server Error';

  return sendError(res, 500, message);
};

module.exports = {
  notFoundHandler,
  errorHandler
};
