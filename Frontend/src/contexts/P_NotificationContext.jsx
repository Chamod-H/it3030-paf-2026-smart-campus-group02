import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const NotificationContext = createContext();

/**
 * Global notification state manager.
 * Connects the navbar bell, dropdown panel, and notifications page.
 */
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  // Computed unread count
  const unreadCount = useMemo(() => 
    notifications.filter(n => !n.isRead).length, 
  [notifications]);

  /**
   * Mock: Fetch notifications from API.
   */
  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      // Logic for real API: const res = await axios.get('/api/notifications');
      // Mock: Simulate small delay and initial data
      await new Promise(r => setTimeout(r, 600));
      
      const mockData = [
        { 
          id: 1, 
          type: 'booking_approved', 
          message: 'Your booking for Lab 01 has been approved!', 
          timestamp: '2 mins ago', 
          isRead: false 
        },
        { 
          id: 2, 
          type: 'ticket_status_changed', 
          message: 'Ticket #1042 was moved to IN_PROGRESS.', 
          timestamp: '1 hour ago', 
          isRead: false 
        },
        { 
          id: 3, 
          type: 'new_comment', 
          message: 'Tech Dana added a comment to your ticket.', 
          timestamp: '3 hours ago', 
          isRead: true 
        },
      ];
      setNotifications(mockData);
      setError(null);
    } catch (err) {
      setError('Failed to load notifications.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  /**
   * Marks a single notification as read.
   */
  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
    // Real API: axios.patch(`/api/notifications/${id}/read`);
  };

  /**
   * Marks all notifications as read.
   */
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    // Real API: axios.patch('/api/notifications/read-all');
  };

  /**
   * Manually add a notification (e.g. via WebSocket/Socket.io).
   */
  const addNotification = (notif) => {
    const newNotif = {
      id: Date.now(),
      isRead: false,
      timestamp: 'Just now',
      ...notif
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  /**
   * Removes a notification from the list.
   */
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    // Real API: axios.delete(`/api/notifications/${id}`);
  };

  const value = {
    notifications,
    unreadCount,
    loading,
    error,
    activeTab,
    setActiveTab,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    addNotification,
    removeNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;
