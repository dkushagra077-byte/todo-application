/**
 * Centralized response handlers to maintain standard API response structures
 */

/**
 * Send a standardized success response
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code (200, 201, etc.)
 * @param {string} message - User-friendly message
 * @param {any} data - Response payload (optional)
 */
const sendSuccess = (res, statusCode = 200, message = 'Success', data = null) => {
  const response = {
    success: true,
    message
  };

  if (data !== null && data !== undefined) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

/**
 * Send a standardized error response
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code (400, 401, 403, 404, 500, etc.)
 * @param {string} message - Error description message
 * @param {any} errors - Detailed validation errors or debugging info (optional)
 */
const sendError = (res, statusCode = 500, message = 'Internal Server Error', errors = null) => {
  const response = {
    success: false,
    message
  };

  if (errors !== null && errors !== undefined) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

module.exports = {
  sendSuccess,
  sendError
};
