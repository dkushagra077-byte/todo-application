import React, { createContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { getToken, setToken, removeToken } from '../utils/token';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(getToken());
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Initialize and verify authentication state on app start
  const checkAuth = useCallback(async () => {
    const savedToken = getToken();
    if (!savedToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      setTokenState(savedToken);
    } catch (err) {
      console.warn('Authentication token verification failed:', err.message);
      removeToken();
      setUser(null);
      setTokenState(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  /**
   * Log in user
   */
  const login = async (email, password) => {
    setAuthError(null);
    try {
      const result = await authService.login({ email, password });
      setToken(result.token);
      setTokenState(result.token);
      setUser(result.user);
      return result;
    } catch (err) {
      setAuthError(err.message);
      throw err;
    }
  };

  /**
   * Register user
   */
  const register = async (name, email, password) => {
    setAuthError(null);
    try {
      const result = await authService.register({ name, email, password });
      setToken(result.token);
      setTokenState(result.token);
      setUser(result.user);
      return result;
    } catch (err) {
      setAuthError(err.message);
      throw err;
    }
  };

  /**
   * Log out user
   */
  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      removeToken();
      setTokenState(null);
      setUser(null);
      setAuthError(null);
    }
  };

  const clearAuthError = () => setAuthError(null);

  const value = {
    user,
    token,
    isAuthenticated: Boolean(user && token),
    loading,
    authError,
    login,
    register,
    logout,
    clearAuthError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

