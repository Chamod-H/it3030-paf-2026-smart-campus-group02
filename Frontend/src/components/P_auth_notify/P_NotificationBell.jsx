import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './P_NotificationBell.css';

/**
 * A notification bell icon with an unread count badge and wiggle animation.
 */
const P_NotificationBell = ({ 
  unreadCount = 0, 
  onClick, 
  hasNew = false 
}) => {
  const [shouldAnimate, setShouldAnimate] = useState(false);

  // Trigger wiggle animation when unreadCount increases or hasNew becomes true
  useEffect(() => {
    if (unreadCount > 0 || hasNew) {
      setShouldAnimate(true);
      const timer = setTimeout(() => setShouldAnimate(false), 800);
      return () => clearTimeout(timer);
    }
  }, [unreadCount, hasNew]);

  // Display '9+' if count is very high
  const displayCount = unreadCount > 99 ? '99+' : unreadCount;

  return (
    <button 
      className={`p-notification-bell ${shouldAnimate ? 'p-nb-animating' : ''}`}
      onClick={onClick}
      aria-label={`Notifications, ${unreadCount} unread`}
    >
      <div className="p-nb-icon-wrapper">
        <svg 
          viewBox="0 0 24 24" 
          width="24" 
          height="24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>

        {unreadCount > 0 && (
          <span className="p-nb-badge">
            {displayCount}
          </span>
        )}
      </div>
    </button>
  );
};

P_NotificationBell.propTypes = {
  unreadCount: PropTypes.number,
  onClick: PropTypes.func,
  hasNew: PropTypes.bool
};

export default P_NotificationBell;
