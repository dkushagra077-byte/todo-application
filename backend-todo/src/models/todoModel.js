const supabase = require('../config/supabase');

/**
 * TodoModel handles all database operations for the `todos` table
 * All queries are strictly scoped to the authenticated user's ID
 */
class TodoModel {
  /**
   * Create a new todo record for the user
   * @param {object} params - { userId, title, description }
   * @returns {Promise<object>} Created todo record
   */
  static async create({ userId, title, description }) {
    const { data, error } = await supabase
      .from('todos')
      .insert({
        user_id: userId,
        title: title.trim(),
        description: description ? description.trim() : null,
        completed: false
      })
      .select('id, user_id, title, description, completed, created_at, updated_at')
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * Retrieve all todos belonging to a specific user
   * @param {string} userId
   * @returns {Promise<Array<object>>} List of todos
   */
  static async findAllByUserId(userId) {
    const { data, error } = await supabase
      .from('todos')
      .select('id, user_id, title, description, completed, created_at, updated_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  }

  /**
   * Retrieve a specific todo by ID ensuring it belongs to the authenticated user
   * @param {string} id - Todo UUID
   * @param {string} userId - User UUID
   * @returns {Promise<object|null>} Todo record or null if not found/unauthorized
   */
  static async findByIdAndUserId(id, userId) {
    const { data, error } = await supabase
      .from('todos')
      .select('id, user_id, title, description, completed, created_at, updated_at')
      .eq('id', id)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * Update a todo record ensuring ownership
   * @param {string} id - Todo UUID
   * @param {string} userId - User UUID
   * @param {object} updates - Fields to update ({ title, description, completed })
   * @returns {Promise<object|null>} Updated todo record
   */
  static async update(id, userId, updates) {
    const payload = {};
    if (updates.title !== undefined) payload.title = updates.title.trim();
    if (updates.description !== undefined) payload.description = updates.description ? updates.description.trim() : null;
    if (updates.completed !== undefined) payload.completed = Boolean(updates.completed);

    const { data, error } = await supabase
      .from('todos')
      .update(payload)
      .eq('id', id)
      .eq('user_id', userId)
      .select('id, user_id, title, description, completed, created_at, updated_at')
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * Delete a todo record ensuring ownership
   * @param {string} id - Todo UUID
   * @param {string} userId - User UUID
   * @returns {Promise<boolean>} True if deleted, false if record was not found
   */
  static async delete(id, userId) {
    const { data, error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)
      .select('id')
      .maybeSingle();

    if (error) {
      throw error;
    }

    return Boolean(data);
  }
}

module.exports = TodoModel;
