import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = ({ user, unreadCount, summaries }) => {
  const navigate = useNavigate();

  return (
    <div className="role-dashboard admin-dashboard">
      <section className="dashboard-metrics-grid">
        <div className="metric-card bg-highlight" onClick={() => navigate('/admin/users')}>
          <div className="metric-icon-box dark">👥</div>
          <div className="metric-info">
            <span className="metric-value">{summaries.users || 142}</span>
            <span className="metric-label">Total Users</span>
          </div>
        </div>
        
        <div className="metric-card bg-highlight" onClick={() => navigate('/admin/bookings')}>
          <div className="metric-icon-box red">⚠️</div>
          <div className="metric-info">
            <span className="metric-value">{summaries.adminApprovals || 5}</span>
            <span className="metric-label">Pending Approvals</span>
          </div>
        </div>

        <div className="metric-card bg-highlight" onClick={() => navigate('/admin/tickets')}>
          <div className="metric-icon-box orange">📈</div>
          <div className="metric-info">
            <span className="metric-value">{summaries.tickets || 12}</span>
            <span className="metric-label">Global Tickets</span>
          </div>
        </div>

        <div className="metric-card bg-highlight" onClick={() => navigate('/admin/facilities')}>
          <div className="metric-icon-box purple">🏢</div>
          <div className="metric-info">
            <span className="metric-value">{summaries.facilities || 24}</span>
            <span className="metric-label">Total Facilities</span>
          </div>
        </div>
      </section>

      <div className="dashboard-split-layout">
        <section className="dashboard-quick-actions">
          <h3 className="section-heading">Admin Shortcuts</h3>
          <div className="action-button-list">
            <button className="action-btn" onClick={() => navigate('/admin/notifications')}>
              <span className="action-icon">📣</span>
              <div className="action-text">
                <strong>Global Broadcast</strong>
                <span>Send campus-wide alerts</span>
              </div>
            </button>
            <button className="action-btn" onClick={() => navigate('/admin/roles')}>
              <span className="action-icon">🔑</span>
              <div className="action-text">
                <strong>Manage Roles</strong>
                <span>Edit permissions & access</span>
              </div>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
