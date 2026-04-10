// Assuming a centralized axios or fetch wrapper inside api.js
import api from './api';

const BASE_URL = '/resources';

/**
 * Service to handle all Facilities & Resources API operations.
 * Communicates directly with the Java Spring Boot Backend.
 */
const I_resourceService = {
  
  // 1. Fetch all resources safely
  getAllResources: async () => {
    try {
      const response = await api.get(BASE_URL);
      return response.data;
    } catch (error) {
      console.error("Error fetching all resources:", error);
      throw error;
    }
  },

  // 2. Fetch a single resource by ID
  getResourceById: async (id) => {
    try {
      const response = await api.get(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching resource ${id}:`, error);
      throw error;
    }
  },

  // 3. Create a new resource (Admin only server-side)
  createResource: async (data) => {
    try {
      const response = await api.post(BASE_URL, data);
      return response.data;
    } catch (error) {
      console.error("Error creating resource:", error);
      throw error;
    }
  },

  // 4. Update an existing resource
  updateResource: async (id, data) => {
    try {
      const response = await api.put(`${BASE_URL}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating resource ${id}:`, error);
      throw error;
    }
  },

  // 5. Delete a resource completely
  deleteResource: async (id) => {
    try {
      const response = await api.delete(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting resource ${id}:`, error);
      throw error;
    }
  },

  // 6. Search resources using query params
  searchResources: async (params) => {
    try {
      const response = await api.get(`${BASE_URL}/search`, { params });
      return response.data;
    } catch (error) {
      console.error("Error searching resources:", error);
      throw error;
    }
  },

  // 7. Advanced filtering via query parameters
  filterResources: async (params) => {
    try {
      const response = await api.get(`${BASE_URL}/filter`, { params });
      return response.data;
    } catch (error) {
      console.error("Error filtering resources:", error);
      throw error;
    }
  },

  // 8. Toggle status safely via PATCH
  updateResourceStatus: async (id, status) => {
    try {
      const response = await api.patch(`${BASE_URL}/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error(`Error updating status for resource ${id}:`, error);
      throw error;
    }
  },

  // 9. Fetch specific availability windows and schedules
  getResourceAvailability: async (id) => {
    try {
      const response = await api.get(`${BASE_URL}/${id}/availability`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching availability for resource ${id}:`, error);
      throw error;
    }
  }
};

export default I_resourceService;
