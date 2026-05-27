import axios from 'axios';

/**
 * Centralized API Client
 * Configured with baseURL and JWT interceptors for automatic auth handling.
 */
const getApiUrl = () => {
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return 'http://localhost:5000/api';
  }
  return import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
};

const api = axios.create({
  baseURL: getApiUrl(),
  timeout: 20000, // 20 second timeout to prevent hanging requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Inject JWT token into headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Handle global errors (e.g., 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Detect if this is a timeout or network error (backend might be sleeping)
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      console.warn('API Request timed out - backend might be sleeping or under heavy load');
    }

    // If token is invalid or expired
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Trigger a page reload or event that AuthContext can catch
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
