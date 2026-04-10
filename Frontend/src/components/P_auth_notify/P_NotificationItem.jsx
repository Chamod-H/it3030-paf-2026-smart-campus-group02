import React from 'react';
import PropTypes from 'prop-types';
import './P_NotificationItem.css';

const TYPE_CONFIG = {
  booking_approved: { icon: '✅', color: '#10b981', title: 'Booking Approved' },
  booking_rejected: { icon: '❌', color: '#ef4444', title: 'Booking Rejected' },
  ticket_status_changed: { icon: '🔄', color: '#3b82f6', title: 'Ticket Updated' },
  new_comment: { icon: '💬', color: '#f59e0b', title: 'New Comment' },
  system: { icon: '📢', color: '#6b7280', title: 'System Alert' },
};

/**
 * A single notification item with type-based styling and icons.
 */
const P_NotificationItem = ({ 
  notification, 
  onClick, 
  onMarkRead 
}) => {
  const { type, message, timestamp, isRead, title: customTitle } = notification;
  const cfg = TYPE_CONFIG[type] || TYPE_CONFIG.system;
  const displayTitle = customTitle || cfg.title;

  const handleClick = (e) => {
    if (onClick) onClick(notification);
  };

  const handleMarkRead = (e) => {
    e.stopPropagation(); // Prevent triggering item click
    if (onMarkRead) onMarkRead(notification.id);
  };

  return (
    <div 
      className={`p-notification-item ${!isRead ? 'unread' : ''}`} 
      onClick={handleClick}
      role="button"
      tabIndex="0"
    >
      <div className="p-ni-icon-box" style={{ backgroundColor: `${cfg.color}15`, color: cfg.color }}>
        {cfg.icon}
      </div>
      
      <div className="p-ni-content">
        <div className="p-ni-header">
          <span className="p-ni-title">{displayTitle}</span>
          <span className="p-ni-time">{timestamp}</span>
        </div>
        <p className="p-ni-message">{message}</p>
      </div>

      <div className="p-ni-actions">
        {!isRead && (
          <button 
            className="p-ni-read-indicator" 
            onClick={handleMarkRead} 
            title="Mark as read"
            aria-label="Mark as read"
          />
        )}
      </div>
    </div>
  );
};

P_NotificationItem.propTypes = {
  notification: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    type: PropTypes.string,
    title: PropTypes.string,
    message: PropTypes.string.isRequired,
    timestamp: PropTypes.string.isRequired,
    isRead: PropTypes.bool
  }).isRequired,
  onClick: PropTypes.func,
  onMarkRead: PropTypes.func
};

export default P_NotificationItem;
