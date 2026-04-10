import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/P_AuthContext';
import Shared_PageHeader from '../../components/common/Shared_PageHeader';
import P_RoleBadge from '../../components/P_auth_notify/P_RoleBadge';
import './Shared_ProfilePage.css';

/**
 * Shared Profile Page
 * Serves as the user's personal hub. Displays core session information (Name, Email, Role),
 * along with extended campus details (Phone, Department). Provides direct links to 
 * Edit mode and Logout sequences.
 */
const Shared_ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // If user somehow lands here without context, ensure fallback
  if (!user) {
    return <div className="shared-profile-loading">Loading profile data...</div>;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <div className="shared-profile-page">
      <Shared_PageHeader 
        title="My Profile" 
        subtitle="View and manage your Smart Campus identity."
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'My Profile' }
        ]}
        actions={
          <button 
            className="profile-edit-btn" 
            onClick={() => navigate('/profile/edit')}
          >
            ✏️ Edit Details
          </button>
        }
      />

      <div className="profile-content-container">
        {/* ── Left Column: Identity Card ── */}
        <div className="profile-identity-card">
          <div className="profile-avatar-large">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.username || user.name} />
            ) : (
              <span className="profile-initials">{getInitials(user.username || user.name)}</span>
            )}
          </div>
          
          <h2 className="profile-name">{user.username || user.name}</h2>
          <p className="profile-email">{user.email}</p>
          
          <div className="profile-role-wrapper">
            <P_RoleBadge role={user.role} size="md" />
          </div>

          <div className="profile-action-stack">
            <button className="profile-logout-btn" onClick={handleLogout}>
              Sign Out
            </button>
          </div>
        </div>

        {/* ── Right Column: Campus Details Base ── */}
        <div className="profile-details-card">
          <h3 className="profile-section-title">Campus Information</h3>
          
          <div className="profile-info-grid">
            
            <div className="info-group">
              <span className="info-label">Full Name</span>
              <span className="info-value">{user.username || user.name || 'Not provided'}</span>
            </div>

            <div className="info-group">
              <span className="info-label">Contact Email</span>
              <span className="info-value">{user.email || 'Not provided'}</span>
            </div>

            <div className="info-group">
              <span className="info-label">Phone Number</span>
              <span className="info-value">{user.phone || 'Not provided'}</span>
            </div>

            <div className="info-group">
              <span className="info-label">Department / Faculty</span>
              <span className="info-value">{user.department || 'Not provided'}</span>
            </div>

            <div className="info-group">
              <span className="info-label">System Role</span>
              <span className="info-value role-text">{user.role || 'STUDENT'}</span>
            </div>

            <div className="info-group">
              <span className="info-label">Account Status</span>
              <span className="info-value status-active">● Active</span>
            </div>

          </div>
          
          <div className="profile-security-section">
            <h3 className="profile-section-title">Security & Preferences</h3>
            <p className="security-notice">
              Your authentication relies on Google OAuth. If you wish to rotate passwords or update 
              your primary Google account, please do so via the Google Account Management portal.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Shared_ProfilePage;
