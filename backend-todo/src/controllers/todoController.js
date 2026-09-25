const TodoService = require('../services/todoService');
const { sendSuccess } = require('../utils/responseHandler');

/**
 * TodoController manages HTTP request/response handling for Todos
 */
class TodoController {
  /**
   * Create a new todo
   * POST /api/todos
   */
  static async createTodo(req, res, next) {
    try {
      const { title, description } = req.body;
      const userId = req.user.id; // Extracted safely from authenticated JWT

      const todo = await TodoService.createTodo(userId, { title, description });
      return sendSuccess(res, 201, 'Todo created successfully', { todo });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all todos for the authenticated user
   * GET /api/todos
   */
  static async getTodos(req, res, next) {
    try {
      const userId = req.user.id;
      const todos = await TodoService.getTodos(userId);
      return sendSuccess(res, 200, 'Todos retrieved successfully', { todos });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a single todo by ID
   * GET /api/todos/:id
   */
  static async getTodoById(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const todo = await TodoService.getTodoById(id, userId);
      return sendSuccess(res, 200, 'Todo retrieved successfully', { todo });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update a todo
   * PUT /api/todos/:id
   */
  static async updateTodo(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const { title, description, completed } = req.body;

      const updatedTodo = await TodoService.updateTodo(id, userId, {
        title,
        description,
        completed
      });

      return sendSuccess(res, 200, 'Todo updated successfully', { todo: updatedTodo });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a todo
   * DELETE /api/todos/:id
   */
  static async deleteTodo(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      await TodoService.deleteTodo(id, userId);
      return sendSuccess(res, 200, 'Todo deleted successfully', null);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TodoController;
