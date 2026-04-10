import api from './api';

/**
 * Role & User Management Service
 * Handles administrative actions related to user roles and access control.
 */
const P_roleService = {
  /**
   * Fetches the complete list of campus members.
   * Useful for the Admin Management table.
   */
  getAllUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  /**
   * Retrieves full details for a specific user.
   */
  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  /**
   * Updates a user's role (e.g. USER -> TECHNICIAN).
   * Strict admin-only access on the backend.
   */
  updateUserRole: async (id, role) => {
    const response = await api.patch(`/users/${id}/role`, { role });
    return response.data;
  },

  /**
   * Advanced user lookup with filtering and search.
   * @param {Object} params - Search query, role filter, status filter.
   */
  filterUsers: async (params) => {
    const response = await api.get('/users', { params });
    return response.data;
  }
};

export default P_roleService;
