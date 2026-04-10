import api from './api';

// Need to safely remap API_BASE_URL variable for the google login redirect
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Authentication Service
 * Handles all identity-related communication with the backend.
 */
const P_authService = {
  /**
   * Redirects the browser to the Google OAuth initiation endpoint.
   */
  startGoogleLogin: () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  },

  /**
   * Sends the OAuth callback parameters to the backend to verify login.
   * @param {Object} params - URL parameters from the callback redirect.
   */
  handleOAuthCallback: async (params) => {
    const response = await api.get('/auth/callback', { params });
    return response.data; // Expecting { token, user }
  },

  /**
   * Reliable way to fetch the current user's session from the server.
   */
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  /**
   * Informs the backend to invalidate the current session.
   */
  logoutUser: async () => {
    await api.post('/auth/logout');
    localStorage.removeItem('smart_campus_token');
    localStorage.removeItem('smart_campus_user');
  },

  /**
   * Updates user profile information (phone, department, etc.).
   * @param {Object} data - Form data from profile setup / settings.
   */
  updateProfile: async (data) => {
    const response = await api.put('/users/profile', data);
    return response.data;
  },

  /**
   * Manage user roles (Admin only).
   * @param {string} userId - Target user ID.
   * @param {string} newRole - Role to assign.
   */
  updateUserRole: async (userId, newRole) => {
    const response = await api.patch(`/admin/users/${userId}/role`, { role: newRole });
    return response.data;
  }
};

export default P_authService;
