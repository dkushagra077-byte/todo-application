const TOKEN_KEY = 'todo_app_token';

/**
 * Retrieve the JWT token from localStorage
 * @returns {string|null}
 */
export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Failed to read token from localStorage', error);
    return null;
  }
};

/**
 * Store the JWT token in localStorage
 * @param {string} token
 */
export const setToken = (token) => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Failed to save token to localStorage', error);
  }
};

/**
 * Remove the JWT token from localStorage
 */
export const removeToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error('Failed to remove token from localStorage', error);
  }
};
