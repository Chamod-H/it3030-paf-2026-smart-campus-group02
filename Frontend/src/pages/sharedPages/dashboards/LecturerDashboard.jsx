import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBell, FiCalendar, FiTool, FiPlusCircle, FiMap, FiAlertCircle } from 'react-icons/fi';

const LecturerDashboard = ({ user, unreadCount, summaries }) => {
  const navigate = useNavigate();

  return (
    <div className="role-dashboard lecturer-dashboard">
      <section className="dashboard-metrics-grid">
        <div className="metric-card" onClick={() => navigate('/notifications')}>
          <div className="metric-icon-box blue"><FiBell /></div>
          <div className="metric-info">
            <span className="metric-value">{unreadCount}</span>
            <span className="metric-label">Unread Alerts</span>
          </div>
        </div>
        
        <div className="metric-card" onClick={() => navigate('/bookings/my')}>
          <div className="metric-icon-box green"><FiCalendar /></div>
          <div className="metric-info">
            <span className="metric-value">{summaries.bookings !== undefined ? summaries.bookings : '...'}</span>
            <span className="metric-label">My Bookings</span>
          </div>
        </div>

        <div className="metric-card" onClick={() => navigate('/tickets/my')}>
          <div className="metric-icon-box orange"><FiTool /></div>
          <div className="metric-info">
            <span className="metric-value">{summaries.tickets !== undefined ? summaries.tickets : '...'}</span>
            <span className="metric-label">My Tracked Issues</span>
          </div>
        </div>
      </section>

      <div className="dashboard-split-layout">
        <section className="dashboard-quick-actions">
          <h3 className="section-heading">Lecturer Tools</h3>
          <div className="action-button-list">
             <button className="action-btn" onClick={() => navigate('/bookings/new')}>
              <span className="action-icon"><FiPlusCircle /></span>
              <div className="action-text">
                <strong>Book a Room</strong>
                <span>Reserve a lab or lecture hall</span>
              </div>
            </button>
            <button className="action-btn" onClick={() => navigate('/facilities')}>
              <span className="action-icon"><FiMap /></span>
              <div className="action-text">
                <strong>Browse Catalogue</strong>
                <span>Find specific AV resources</span>
              </div>
            </button>
            <button className="action-btn" onClick={() => navigate('/tickets/new')}>
              <span className="action-icon"><FiAlertCircle /></span>
              <div className="action-text">
                <strong>Report an Issue</strong>
                <span>Flag broken classroom tech</span>
              </div>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LecturerDashboard;
