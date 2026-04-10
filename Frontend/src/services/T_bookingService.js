import api from './api';

const BASE_URL = '/bookings';

/**
 * Core Service Handler mapping all HTTP API requests for Module B: Booking Management.
 * Explicitly follows standard RESTful conventions anticipated by the backend assignment requirements.
 */
const T_bookingService = {
  /**
   * Retrieves all system bookings globally (Admin clearance only)
   */
  getAllBookings: async () => {
    try {
      const response = await api.get(`${BASE_URL}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching all internal bookings:', error);
      throw error;
    }
  },

  /**
   * Retrieves bookings specifically tied to the currently authenticated Student/Staff member
   */
  getMyBookings: async () => {
    try {
      // In physical deployment, JWT tokens will be passed natively in the Axios interceptor
      const response = await api.get(`${BASE_URL}/my`);
      return response.data;
    } catch (error) {
      console.error('Error fetching active user bookings:', error);
      throw error;
    }
  },

  /**
   * Retrieves a deeply specific booking payload by its precise ID reference
   */
  getBookingById: async (id) => {
    try {
      const response = await api.get(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error retrieving target booking ${id}:`, error);
      throw error;
    }
  },

  /**
   * Initializes a brand new booking request block dynamically
   * @param {Object} data - Form Booking payload
   */
  createBooking: async (data) => {
    try {
      const response = await api.post(`${BASE_URL}`, data);
      return response.data;
    } catch (error) {
      console.error('Error synthesizing booking creation POST:', error);
      throw error;
    }
  },

  /**
   * Transmits modifications for an existing booking's core parameters (Date, Time, Purpose mapping)
   */
  updateBooking: async (id, data) => {
    try {
      const response = await api.put(`${BASE_URL}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error running PUT update on booking ${id}:`, error);
      throw error;
    }
  },

  /**
   * Forces a safe-cancellation of an active booking 
   * (Natively available to requesting User or via Admin Overrides)
   */
  cancelBooking: async (id) => {
    try {
      const response = await api.patch(`${BASE_URL}/${id}/cancel`);
      return response.data;
    } catch (error) {
      console.error(`Error forcing system cancel on booking ${id}:`, error);
      throw error;
    }
  },

  /**
   * Resets a booking directly back to PENDING state unconditionally (Secure Admin Endpoint)
   * @param {string} id - Active Booking ID
   */
  setPendingBooking: async (id) => {
    try {
      const response = await api.patch(`${BASE_URL}/${id}/pending`);
      return response.data;
    } catch (error) {
      console.error(`System error setting targeted booking ${id} back to pending:`, error);
      throw error;
    }
  },

  /**
   * Physically approves a targeted PENDING booking (Secure Admin Endpoint)
   * @param {string} id - Active Booking ID
   * @param {Object} payload - Optional administrative injection: e.g., { adminNote: "..." }
   */
  approveBooking: async (id, payload) => {
    try {
      const response = await api.patch(`${BASE_URL}/${id}/approve`, payload);
      return response.data;
    } catch (error) {
      console.error(`System error approving target booking ${id}:`, error);
      throw error;
    }
  },

  /**
   * Rejects a targeted PENDING booking and forces reason capture (Secure Admin Endpoint)
   * @param {string} id - Active Booking ID
   * @param {Object} payload - Contains required fallback: e.g., { rejectReason: "..." }
   */
  rejectBooking: async (id, payload) => {
    try {
      const response = await api.patch(`${BASE_URL}/${id}/reject`, payload);
      return response.data;
    } catch (error) {
      console.error(`System error actively rejecting booking ${id}:`, error);
      throw error;
    }
  },

  /**
   * Contacts backend safely to validate if a mathematically proposed timeslot natively conflicts with locked DB records
   * @param {Object} params - Validating data: { resourceId, date, startTime, endTime }
   */
  checkBookingConflict: async (params) => {
    try {
      const response = await api.post(`${BASE_URL}/check-conflict`, params);
      return response.data; // Standard mapped format: { conflict: boolean, details: Object }
    } catch (error) {
      console.error('Error physically evaluating booking collision conflict:', error);
      throw error;
    }
  },

  /**
   * Injects filter logic to pull strictly PENDING bookings specifically aimed for the Admin Inbox queues
   */
  getPendingBookings: async () => {
    try {
      const response = await api.get(`${BASE_URL}?status=PENDING`);
      return response.data;
    } catch (error) {
      console.error('Error fetching global pending booking targets:', error);
      throw error;
    }
  },

  /**
   * Deep searching backend query hook
   * @param {Object} params - Complex query mappings (e.g., status, resourceType, date bounds)
   */
  filterBookings: async (params) => {
    try {
      const response = await api.get(`${BASE_URL}`, { params });
      return response.data;
    } catch (error) {
      console.error('Error filtering dynamic backend bookings array:', error);
      throw error;
    }
  }
};

export default T_bookingService;
