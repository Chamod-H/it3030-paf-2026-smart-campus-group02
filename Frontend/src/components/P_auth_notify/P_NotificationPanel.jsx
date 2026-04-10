import P_NotificationItem from './P_NotificationItem';

/**
 * Quick-access dropdown panel for notifications.
 * Supports tabs (All/Unread) and type-based icons via P_NotificationItem.
 */
const P_NotificationPanel = ({
  notifications = [],
  onMarkAllRead,
  onOpenNotification,
  onMarkRead,
  onClose,
  onViewAll
}) => {
  const [activeTab, setActiveTab] = useState('all');

  const filteredNotifications = activeTab === 'unread' 
    ? notifications.filter(n => !n.isRead) 
    : notifications;

  return (
    <div className="p-notification-panel">
      {/* Header */}
      <div className="p-np-header">
        <div className="p-np-title-row">
          <h3>Notifications</h3>
          <button className="p-np-close-btn" onClick={onClose} aria-label="Close panel">✕</button>
        </div>
        <div className="p-np-tabs">
          <button 
            className={`p-np-tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All
          </button>
          <button 
            className={`p-np-tab ${activeTab === 'unread' ? 'active' : ''}`}
            onClick={() => setActiveTab('unread')}
          >
            Unread ({notifications.filter(n => !n.isRead).length})
          </button>
        </div>
      </div>

      {/* List Body */}
      <div className="p-np-body">
        {filteredNotifications.length === 0 ? (
          <div className="p-np-empty">
            <span className="p-np-empty-icon">📭</span>
            <p>No {activeTab} notifications at the moment.</p>
          </div>
        ) : (
          <div className="p-np-list">
            {filteredNotifications.map((notif) => (
              <P_NotificationItem 
                key={notif.id}
                notification={notif}
                onClick={onOpenNotification}
                onMarkRead={onMarkRead}
              />
            ))}
          </div>
        )}
      </div>


      {/* Footer */}
      <div className="p-np-footer">
        {notifications.length > 0 && (
          <button className="p-np-mark-read" onClick={onMarkAllRead}>
            Mark all as read
          </button>
        )}
        <button className="p-np-view-all" onClick={onViewAll}>
          View all notifications
        </button>
      </div>
    </div>
  );
};

P_NotificationPanel.propTypes = {
  notifications: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    type: PropTypes.string,
    message: PropTypes.string.isRequired,
    timestamp: PropTypes.string.isRequired,
    isRead: PropTypes.bool
  })),
  onMarkAllRead: PropTypes.func,
  onOpenNotification: PropTypes.func,
  onClose: PropTypes.func,
  onViewAll: PropTypes.func
};

export default P_NotificationPanel;
