import React, { useState, useMemo } from 'react';
import { useNotifications } from '../../contexts/P_NotificationContext';
import P_NotificationTabs from '../../components/P_auth_notify/P_NotificationTabs';
import P_NotificationItem from '../../components/P_auth_notify/P_NotificationItem';
import './P_NotificationsPage.css';

/**
 * Full page view for notifications.
 * Allows filtering by type and read/unread status.
 */
const P_NotificationsPage = () => {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    removeNotification,
    loading 
  } = useNotifications();

  const [activeTab, setActiveTab] = useState('all');
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'unread' | 'read'

  // Refined filtering logic
  const filteredNotifications = useMemo(() => {
    let result = [...notifications];

    // Filter by category (Tab)
    if (activeTab !== 'all') {
      result = result.filter(n => {
        if (activeTab === 'bookings') return n.type.includes('booking');
        if (activeTab === 'tickets') return n.type.includes('ticket');
        if (activeTab === 'comments') return n.type.includes('comment');
        return true;
      });
    }

    // Filter by read/unread status
    if (filterMode === 'unread') result = result.filter(n => !n.isRead);
    if (filterMode === 'read') result = result.filter(n => n.isRead);

    return result;
  }, [notifications, activeTab, filterMode]);

  return (
    <div className="p-notifications-page">
      <div className="p-notif-container">
        <header className="p-notif-header">
          <div className="p-notif-title-area">
            <h1>Notifications</h1>
            <span className="p-notif-count-pill">{unreadCount} Unread</span>
          </div>
          
          <div className="p-notif-global-actions">
            <button 
              className="p-notif-btn-text" 
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              Mark all as read
            </button>
          </div>
        </header>

        <section className="p-notif-navbar">
          <P_NotificationTabs 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
          />
          
          <div className="p-notif-status-filters">
            <button 
              className={`p-notif-filter-chip ${filterMode === 'all' ? 'active' : ''}`}
              onClick={() => setFilterMode('all')}
            >
              All
            </button>
            <button 
              className={`p-notif-filter-chip ${filterMode === 'unread' ? 'active' : ''}`}
              onClick={() => setFilterMode('unread')}
            >
              Unread
            </button>
            <button 
              className={`p-notif-filter-chip ${filterMode === 'read' ? 'active' : ''}`}
              onClick={() => setFilterMode('read')}
            >
              Read
            </button>
          </div>
        </section>

        <main className="p-notif-list-container">
          {loading ? (
            <div className="p-notif-loader-box">
              <div className="p-notif-spinner"></div>
              <p>Loading your updates...</p>
            </div>
          ) : filteredNotifications.length > 0 ? (
            <div className="p-notif-grid">
              {filteredNotifications.map(notif => (
                <P_NotificationItem 
                  key={notif.id}
                  notification={notif}
                  onClick={() => markAsRead(notif.id)}
                  onMarkRead={() => markAsRead(notif.id)}
                  onDelete={() => removeNotification(notif.id)}
                />
              ))}
            </div>
          ) : (
            <div className="p-notif-empty">
              <div className="p-notif-empty-icon">🔔</div>
              <h3>No notifications found</h3>
              <p>You're all caught up! New updates will appear here.</p>
              {(activeTab !== 'all' || filterMode !== 'all') && (
                <button 
                  className="p-notif-reset-btn"
                  onClick={() => { setActiveTab('all'); setFilterMode('all'); }}
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default P_NotificationsPage;
