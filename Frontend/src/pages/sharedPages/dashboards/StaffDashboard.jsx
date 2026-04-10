import React from 'react';
import { useNavigate } from 'react-router-dom';

const StaffDashboard = ({ user, unreadCount, summaries }) => {
  const navigate = useNavigate();

  return (
    <div className="role-dashboard staff-dashboard">
      <section className="dashboard-metrics-grid">
        <div className="metric-card bg-highlight" onClick={() => navigate('/tickets/queue')}>
          <div className="metric-icon-box dark">🔧</div>
          <div className="metric-info">
            <span className="metric-value">{summaries.techQueue || 8}</span>
            <span className="metric-label">Tasks in Queue</span>
          </div>
        </div>

        <div className="metric-card" onClick={() => navigate('/notifications')}>
          <div className="metric-icon-box blue">🔔</div>
          <div className="metric-info">
            <span className="metric-value">{unreadCount}</span>
            <span className="metric-label">Unread Pings</span>
          </div>
        </div>
        
        <div className="metric-card" onClick={() => navigate('/facilities')}>
          <div className="metric-icon-box purple">🏢</div>
          <div className="metric-info">
            <span className="metric-value">{summaries.facilities || 124}</span>
            <span className="metric-label">Managed Resources</span>
          </div>
        </div>
      </section>

      <div className="dashboard-split-layout">
        <section className="dashboard-quick-actions">
          <h3 className="section-heading">Operational Actions</h3>
          <div className="action-button-list">
            <button className="action-btn" onClick={() => navigate('/bookings/calendar')}>
              <span className="action-icon">📆</span>
              <div className="action-text">
                <strong>Check Calendars</strong>
                <span>Find empty blocks for repairs</span>
              </div>
            </button>
            <button className="action-btn" onClick={() => navigate('/facilities')}>
              <span className="action-icon">⚠️</span>
              <div className="action-text">
                <strong>Mark Out of Order</strong>
                <span>Toggle facility status offline</span>
              </div>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default StaffDashboard;
