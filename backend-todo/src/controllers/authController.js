const AuthService = require('../services/authService');
const { sendSuccess } = require('../utils/responseHandler');

/**
 * AuthController manages request/response handling for authentication
 */
class AuthController {
  /**
   * Register a new user
   * POST /api/auth/register
   */
  static async register(req, res, next) {
    try {
      const { name, email, password } = req.body;
      const data = await AuthService.register({ name, email, password });
      return sendSuccess(res, 201, 'User registered successfully', data);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Log in an existing user
   * POST /api/auth/login
   */
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const data = await AuthService.login({ email, password });
      return sendSuccess(res, 200, 'Login successful', data);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get current authenticated user details
   * GET /api/auth/me
   */
  static async getCurrentUser(req, res, next) {
    try {
      const user = await AuthService.getCurrentUser(req.user.id);
      return sendSuccess(res, 200, 'User profile retrieved successfully', { user });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Log out current user (client-side token clearance acknowledgement)
   * POST /api/auth/logout
   */
  static async logout(req, res, next) {
    try {
      return sendSuccess(res, 200, 'Logged out successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
