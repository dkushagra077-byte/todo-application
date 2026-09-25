const bcrypt = require('bcryptjs');
const UserModel = require('../models/userModel');
const { generateToken } = require('../utils/jwt');

const BCRYPT_SALT_ROUNDS = 10;

/**
 * AuthService handles business logic for authentication and authorization
 */
class AuthService {
  /**
   * Register a new user
   * @param {object} param0 - { name, email, password }
   * @returns {Promise<{ user: object, token: string }>}
   */
  static async register({ name, email, password }) {
    // 1. Check if email already exists
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      const error = new Error('An account with this email address already exists');
      error.statusCode = 409;
      throw error;
    }

    // 2. Hash the password with bcrypt (NEVER store plain-text passwords)
    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

    // 3. Persist the user record in Supabase
    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword
    });

    // 4. Generate JWT authentication token
    const token = generateToken({
      id: newUser.id,
      email: newUser.email,
      name: newUser.name
    });

    return {
      user: newUser,
      token
    };
  }

  /**
   * Authenticate a user with email and password
   * @param {object} param0 - { email, password }
   * @returns {Promise<{ user: object, token: string }>}
   */
  static async login({ email, password }) {
    // 1. Find user by email
    const user = await UserModel.findByEmail(email);
    if (!user) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    // 2. Securely verify password with bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    // 3. Generate JWT authentication token
    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name
    });

    // 4. Return safe user data (exclude password hash)
    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
      updated_at: user.updated_at
    };

    return {
      user: safeUser,
      token
    };
  }

  /**
   * Get user profile by ID
   * @param {string} userId
   * @returns {Promise<object>}
   */
  static async getCurrentUser(userId) {
    const user = await UserModel.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    return user;
  }
}

module.exports = AuthService;
