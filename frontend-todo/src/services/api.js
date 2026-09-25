import axios from 'axios';
import { getToken, removeToken } from '../utils/token';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Attach JWT Bearer token if present
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Format error messages & handle 401
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      // Token expired or invalid
      if (error.response.status === 401) {
        removeToken();
      }
      
      const serverMessage = error.response.data && error.response.data.message
        ? error.response.data.message
        : `Request failed with status code ${error.response.status}`;
      
      return Promise.reject(new Error(serverMessage));
    } else if (error.request) {
      return Promise.reject(new Error('Cannot reach server. Please check your backend connection.'));
    } else {
      return Promise.reject(error);
    }
  }
);

export default api;
