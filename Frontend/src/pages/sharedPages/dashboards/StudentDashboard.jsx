import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBell, FiCalendar, FiTool, FiMap, FiAlertCircle } from 'react-icons/fi';

const StudentDashboard = ({ user, unreadCount, summaries }) => {
  const navigate = useNavigate();

  return (
    <div className="role-dashboard student-dashboard">
      <section className="dashboard-metrics-grid">
        <div className="metric-card" onClick={() => navigate('/notifications')}>
          <div className="metric-icon-box blue"><FiBell /></div>
          <div className="metric-info">
            <span className="metric-value">{unreadCount}</span>
            <span className="metric-label">My Alerts</span>
          </div>
        </div>
        
        <div className="metric-card" onClick={() => navigate('/bookings/calendar')}>
          <div className="metric-icon-box green"><FiCalendar /></div>
          <div className="metric-info">
            <span className="metric-value">Active</span>
            <span className="metric-label">Campus Calendars</span>
          </div>
        </div>

        <div className="metric-card" onClick={() => navigate('/tickets/my')}>
          <div className="metric-icon-box orange"><FiTool /></div>
          <div className="metric-info">
            <span className="metric-value">{summaries.tickets !== undefined ? summaries.tickets : '...'}</span>
            <span className="metric-label">Reported Issues</span>
          </div>
        </div>
      </section>

      <div className="dashboard-split-layout">
        <section className="dashboard-quick-actions">
          <h3 className="section-heading">Student Actions</h3>
          <div className="action-button-list">
            <button className="action-btn" onClick={() => navigate('/facilities')}>
              <span className="action-icon"><FiMap /></span>
              <div className="action-text">
                <strong>Explore Facilities</strong>
                <span>Check capacities and open areas</span>
              </div>
            </button>
            <button className="action-btn" onClick={() => navigate('/tickets/new')}>
              <span className="action-icon"><FiAlertCircle /></span>
              <div className="action-text">
                <strong>Report Broken Tech</strong>
                <span>Help campus staff find issues</span>
              </div>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default StudentDashboard;
