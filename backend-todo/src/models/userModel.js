const supabase = require('../config/supabase');

/**
 * UserModel handles all database operations for the `users` table
 */
class UserModel {
  /**
   * Insert a new user into the database
   * @param {object} userData - { name, email, password (hashed) }
   * @returns {Promise<object>} Created user record (without password)
   */
  static async create({ name, email, password }) {
    const { data, error } = await supabase
      .from('users')
      .insert({
        name,
        email: email.toLowerCase().trim(),
        password
      })
      .select('id, name, email, created_at, updated_at')
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * Find a user by email, including the hashed password for authentication
   * @param {string} email
   * @returns {Promise<object|null>} User record or null
   */
  static async findByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, password, created_at, updated_at')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * Find a user by their UUID primary key (never returns password)
   * @param {string} id
   * @returns {Promise<object|null>} User record without password
   */
  static async findById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, created_at, updated_at')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  }
}

module.exports = UserModel;
