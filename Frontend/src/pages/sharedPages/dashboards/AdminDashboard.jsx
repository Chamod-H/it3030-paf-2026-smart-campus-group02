import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUsers, FiAlertTriangle, FiTrendingUp, FiBox, FiBell, FiKey } from 'react-icons/fi';

const AdminDashboard = ({ user, unreadCount, summaries }) => {
  const navigate = useNavigate();

  return (
    <div className="role-dashboard admin-dashboard">
      <section className="dashboard-metrics-grid">
        <div className="metric-card bg-highlight" onClick={() => navigate('/admin/users')}>
          <div className="metric-icon-box dark"><FiUsers /></div>
          <div className="metric-info">
            <span className="metric-value">{summaries.users !== undefined ? summaries.users : '...'}</span>
            <span className="metric-label">Total Users</span>
          </div>
        </div>
        
        <div className="metric-card bg-highlight" onClick={() => navigate('/admin/bookings')}>
          <div className="metric-icon-box red"><FiAlertTriangle /></div>
          <div className="metric-info">
            <span className="metric-value">{summaries.adminApprovals !== undefined ? summaries.adminApprovals : '...'}</span>
            <span className="metric-label">Pending Approvals</span>
          </div>
        </div>

        <div className="metric-card bg-highlight" onClick={() => navigate('/admin/tickets')}>
          <div className="metric-icon-box orange"><FiTrendingUp /></div>
          <div className="metric-info">
            <span className="metric-value">{summaries.tickets !== undefined ? summaries.tickets : '...'}</span>
            <span className="metric-label">Global Tickets</span>
          </div>
        </div>

        <div className="metric-card bg-highlight" onClick={() => navigate('/admin/facilities')}>
          <div className="metric-icon-box purple"><FiBox /></div>
          <div className="metric-info">
            <span className="metric-value">{summaries.facilities !== undefined ? summaries.facilities : '...'}</span>
            <span className="metric-label">Total Facilities</span>
          </div>
        </div>
      </section>

      <div className="dashboard-split-layout">
        <section className="dashboard-quick-actions">
          <h3 className="section-heading">Admin Shortcuts</h3>
          <div className="action-button-list">
            <button className="action-btn" onClick={() => navigate('/admin/notifications')}>
              <span className="action-icon"><FiBell /></span>
              <div className="action-text">
                <strong>Global Broadcast</strong>
                <span>Send campus-wide alerts</span>
              </div>
            </button>
            <button className="action-btn" onClick={() => navigate('/admin/roles')}>
              <span className="action-icon"><FiKey /></span>
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
