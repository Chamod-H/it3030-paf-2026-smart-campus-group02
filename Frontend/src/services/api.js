import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Global Shared API Client
 * This instance configures Axios for all backend communications.
 * It automatically maps Base URLs, injects authorization bearers, 
 * and handles global error trapping (like auto-logout on 401s).
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request Interceptor ──
// Before every single API call goes out, silently dig into LocalStorage
// and staple the JWT token to the `Authorization` header.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('smart_campus_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ── Response Interceptor ──
// Monitor all incoming responses. If the backend yells '401 Unauthorized',
// the token is likely expired, so immediately clean out local storage and route home.
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Global unauthenticated/forbidden redirect trap
      console.warn("Session expired or unauthorized. Redirecting to login.");
      localStorage.removeItem('smart_campus_token');
      localStorage.removeItem('smart_campus_user');
      localStorage.removeItem('is_google_auth');
      
      // Perform hard reload router trap to purge Context state cleanly
      window.location.href = '/login?expired=true';
    }
    return Promise.reject(error);
  }
);

export default api;
