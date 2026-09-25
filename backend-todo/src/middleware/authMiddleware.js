const { verifyToken } = require('../utils/jwt');
const { sendError } = require('../utils/responseHandler');

/**
 * Authentication middleware to verify JWT and attach user to request
 */
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 401, 'Access denied. No authentication token provided.');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return sendError(res, 401, 'Access denied. Invalid token format.');
    }

    const decoded = verifyToken(token);
    
    // Attach authenticated user information to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return sendError(res, 401, 'Authentication token has expired. Please log in again.');
    }
    return sendError(res, 401, 'Invalid authentication token.');
  }
};

module.exports = authMiddleware;
