const { sendError } = require('../utils/responseHandler');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validate registration request payload
 */
const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push('Name is required and must be at least 2 characters long');
  }

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    errors.push('A valid email address is required');
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    errors.push('Password is required and must be at least 6 characters long');
  }

  if (errors.length > 0) {
    return sendError(res, 400, errors[0], errors);
  }

  next();
};

/**
 * Validate login request payload
 */
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    errors.push('A valid email address is required');
  }

  if (!password || typeof password !== 'string' || password.trim().length === 0) {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    return sendError(res, 400, errors[0], errors);
  }

  next();
};

/**
 * Validate create todo request payload
 */
const validateCreateTodo = (req, res, next) => {
  const { title, description } = req.body;
  const errors = [];

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    errors.push('Title is required and cannot be empty');
  }

  if (title && title.trim().length > 255) {
    errors.push('Title cannot exceed 255 characters');
  }

  if (description !== undefined && description !== null && typeof description !== 'string') {
    errors.push('Description must be a string');
  }

  if (errors.length > 0) {
    return sendError(res, 400, errors[0], errors);
  }

  next();
};

/**
 * Validate update todo request payload
 */
const validateUpdateTodo = (req, res, next) => {
  const { title, description, completed } = req.body;
  const errors = [];

  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim().length === 0) {
      errors.push('Title cannot be empty');
    } else if (title.trim().length > 255) {
      errors.push('Title cannot exceed 255 characters');
    }
  }

  if (description !== undefined && description !== null && typeof description !== 'string') {
    errors.push('Description must be a string');
  }

  if (completed !== undefined && typeof completed !== 'boolean') {
    errors.push('Completed must be a boolean (true or false)');
  }

  if (errors.length > 0) {
    return sendError(res, 400, errors[0], errors);
  }

  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateCreateTodo,
  validateUpdateTodo
};
