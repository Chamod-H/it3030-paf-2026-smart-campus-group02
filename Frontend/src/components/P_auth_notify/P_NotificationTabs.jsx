import React from 'react';
import PropTypes from 'prop-types';
import './P_NotificationTabs.css';

const TABS = [
  { id: 'all', label: 'All', icon: '🔔' },
  { id: 'unread', label: 'Unread', icon: '🔵' },
  { id: 'bookings', label: 'Bookings', icon: '📅' },
  { id: 'tickets', label: 'Tickets', icon: '🎫' },
  { id: 'comments', label: 'Comments', icon: '💬' },
];

/**
 * Filter tabs for notifications page or panel.
 */
const P_NotificationTabs = ({ 
  activeTab = 'all', 
  setActiveTab,
  counts = {} // Optional: { all: 10, unread: 5, ... }
}) => {
  return (
    <nav className="p-notification-tabs" aria-label="Notification filters">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        const count = counts[tab.id];

        return (
          <button
            key={tab.id}
            className={`p-nt-tab ${isActive ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            aria-current={isActive ? 'page' : undefined}
          >
            <span className="p-nt-tab-icon" aria-hidden="true">{tab.icon}</span>
            <span className="p-nt-tab-label">{tab.label}</span>
            {count > 0 && (
              <span className="p-nt-tab-count">{count}</span>
            )}
          </button>
        );
      })}
    </nav>
  );
};

P_NotificationTabs.propTypes = {
  activeTab: PropTypes.string,
  setActiveTab: PropTypes.func.isRequired,
  counts: PropTypes.objectOf(PropTypes.number)
};

export default P_NotificationTabs;
