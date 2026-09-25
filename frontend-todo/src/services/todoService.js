import api from './api';

export const todoService = {
  /**
   * Fetch all todos for the authenticated user
   * @returns {Promise<Array<object>>}
   */
  async getTodos() {
    const res = await api.get('/todos');
    return res.data.todos;
  },

  /**
   * Fetch a single todo by ID
   * @param {string} id
   * @returns {Promise<object>}
   */
  async getTodoById(id) {
    const res = await api.get(`/todos/${id}`);
    return res.data.todo;
  },

  /**
   * Create a new todo
   * @param {object} param0 - { title, description }
   * @returns {Promise<object>}
   */
  async createTodo({ title, description }) {
    const res = await api.post('/todos', { title, description });
    return res.data.todo;
  },

  /**
   * Update a todo
   * @param {string} id
   * @param {object} updates - { title, description, completed }
   * @returns {Promise<object>}
   */
  async updateTodo(id, updates) {
    const res = await api.put(`/todos/${id}`, updates);
    return res.data.todo;
  },

  /**
   * Delete a todo
   * @param {string} id
   * @returns {Promise<void>}
   */
  async deleteTodo(id) {
    await api.delete(`/todos/${id}`);
  }
};
