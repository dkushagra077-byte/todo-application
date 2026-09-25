import api from './api';

export const authService = {
  /**
   * Register a new user
   * @param {object} param0 - { name, email, password }
   * @returns {Promise<object>}
   */
  async register({ name, email, password }) {
    const res = await api.post('/auth/register', { name, email, password });
    return res.data;
  },

  /**
   * Login an existing user
   * @param {object} param0 - { email, password }
   * @returns {Promise<object>}
   */
  async login({ email, password }) {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  },

  /**
   * Fetch current authenticated user profile
   * @returns {Promise<object>}
   */
  async getCurrentUser() {
    const res = await api.get('/auth/me');
    return res.data.user;
  },

  /**
   * Logout user
   * @returns {Promise<void>}
   */
  async logout() {
    try {
      await api.post('/auth/logout');
    } catch {
      // Continue even if network error on logout
    }
  }
};
