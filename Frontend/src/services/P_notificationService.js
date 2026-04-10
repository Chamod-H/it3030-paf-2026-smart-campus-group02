import api from './api';

/**
 * Notification Service
 * Manages all alert and real-time update communication.
 */
const P_notificationService = {
  /**
   * Fetches all notifications for the current user.
   * @param {Object} params - Filtering params (type, read status, pagination).
   */
  getMyNotifications: async (params = {}) => {
    const response = await api.get('/notifications', { params });
    return response.data;
  },

  /**
   * Quick check for the number of unread alerts.
   */
  getUnreadCount: async () => {
    const response = await api.get('/notifications/unread-count');
    return response.data; // Expecting { count: X }
  },

  /**
   * Marks a specific notification as viewed.
   */
  markNotificationAsRead: async (id) => {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
  },

  /**
   * Bulk update to clear all unread statuses.
   */
  markAllNotificationsAsRead: async () => {
    const response = await api.patch('/notifications/read-all');
    return response.data;
  },

  /**
   * Permanent removal of a notification.
   */
  deleteNotification: async (id) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  },

  /**
   * Search or heavily filter notifications.
   * Useful for the full page view.
   */
  filterNotifications: async (filters) => {
    const response = await api.get('/notifications', { params: filters });
    return response.data;
  }
};

export default P_notificationService;
