const TodoModel = require('../models/todoModel');

/**
 * TodoService handles business logic for managing Todos
 */
class TodoService {
  /**
   * Create a new todo for the authenticated user
   * @param {string} userId - Authenticated user UUID
   * @param {object} todoData - { title, description }
   * @returns {Promise<object>} Created todo
   */
  static async createTodo(userId, { title, description }) {
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      const error = new Error('Title is required and must not be empty');
      error.statusCode = 400;
      throw error;
    }

    return await TodoModel.create({
      userId,
      title,
      description
    });
  }

  /**
   * Get all todos for the authenticated user
   * @param {string} userId
   * @returns {Promise<Array<object>>}
   */
  static async getTodos(userId) {
    return await TodoModel.findAllByUserId(userId);
  }

  /**
   * Get a single todo by ID for the authenticated user
   * @param {string} id - Todo UUID
   * @param {string} userId - User UUID
   * @returns {Promise<object>}
   */
  static async getTodoById(id, userId) {
    const todo = await TodoModel.findByIdAndUserId(id, userId);
    if (!todo) {
      const error = new Error('Todo not found');
      error.statusCode = 404;
      throw error;
    }
    return todo;
  }

  /**
   * Update a todo for the authenticated user
   * @param {string} id - Todo UUID
   * @param {string} userId - User UUID
   * @param {object} updates - { title, description, completed }
   * @returns {Promise<object>}
   */
  static async updateTodo(id, userId, updates) {
    // Check if the todo exists and belongs to the user
    const existing = await TodoModel.findByIdAndUserId(id, userId);
    if (!existing) {
      const error = new Error('Todo not found');
      error.statusCode = 404;
      throw error;
    }

    // Validate updates if provided
    if (updates.title !== undefined && (typeof updates.title !== 'string' || updates.title.trim().length === 0)) {
      const error = new Error('Title must not be empty');
      error.statusCode = 400;
      throw error;
    }

    return await TodoModel.update(id, userId, updates);
  }

  /**
   * Delete a todo for the authenticated user
   * @param {string} id - Todo UUID
   * @param {string} userId - User UUID
   * @returns {Promise<void>}
   */
  static async deleteTodo(id, userId) {
    const deleted = await TodoModel.delete(id, userId);
    if (!deleted) {
      const error = new Error('Todo not found');
      error.statusCode = 404;
      throw error;
    }
  }
}

module.exports = TodoService;
