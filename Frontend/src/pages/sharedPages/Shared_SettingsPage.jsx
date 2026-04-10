import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/P_AuthContext';
import Shared_PageHeader from '../../components/common/Shared_PageHeader';
import './Shared_SettingsPage.css';

/**
 * Shared Settings Page
 * A centralized hub for user preferences, including notifications, theming, and security.
 */
const Shared_SettingsPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Mock State for Preferences (Normally synced with a backend user profile)
  const [preferences, setPreferences] = useState({
    emailAlerts: true,
    pushNotifications: false,
    weeklyDigest: true,
    theme: 'system', // 'light', 'dark', 'system'
    language: 'en'
  });

  const handleToggle = (key) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPreferences(prev => ({ ...prev, [name]: value }));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="shared-settings-page">
      <Shared_PageHeader 
        title="Settings & Preferences" 
        subtitle="Manage your notifications, interface themes, and account security."
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Settings' }
        ]}
      />

      <div className="settings-container">
        
        {/* ── Column 1: App Preferences ── */}
        <div className="settings-column">
          
          {/* Notification Block */}
          <section className="settings-card">
            <div className="settings-card-header">
              <span className="sc-icon">🔔</span>
              <h3 className="sc-title">Notification Preferences</h3>
            </div>
            
            <div className="setting-item toggle-item">
              <div className="setting-text">
                <span className="setting-label">Email Alerts</span>
                <span className="setting-desc">Receive immediate emails for critical ticket updates.</span>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={preferences.emailAlerts} 
                  onChange={() => handleToggle('emailAlerts')} 
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="setting-item toggle-item">
              <div className="setting-text">
                <span className="setting-label">Browser Push Notifications</span>
                <span className="setting-desc">Allow the browser to notify you when the app is minimized.</span>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={preferences.pushNotifications} 
                  onChange={() => handleToggle('pushNotifications')} 
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="setting-item toggle-item">
              <div className="setting-text">
                <span className="setting-label">Weekly Digest</span>
                <span className="setting-desc">A summary of your bookings and campus events.</span>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={preferences.weeklyDigest} 
                  onChange={() => handleToggle('weeklyDigest')} 
                />
                <span className="slider"></span>
              </label>
            </div>
          </section>

          {/* Interface Block */}
          <section className="settings-card">
            <div className="settings-card-header">
              <span className="sc-icon">✨</span>
              <h3 className="sc-title">Interface Options</h3>
            </div>
            
            <div className="setting-item dropdown-item">
              <div className="setting-text">
                <span className="setting-label">Theme Mode</span>
                <span className="setting-desc">Choose your preferred visual aesthetic.</span>
              </div>
              <select name="theme" value={preferences.theme} onChange={handleChange} className="settings-select">
                <option value="light">Light Mode</option>
                <option value="dark">Dark Mode</option>
                <option value="system">Use System Setting</option>
              </select>
            </div>

            <div className="setting-item dropdown-item">
              <div className="setting-text">
                <span className="setting-label">System Language</span>
                <span className="setting-desc">Currently, only English is fully supported.</span>
              </div>
              <select name="language" value={preferences.language} onChange={handleChange} className="settings-select">
                <option value="en">English (US)</option>
              </select>
            </div>
          </section>

        </div>

        {/* ── Column 2: Account & Security ── */}
        <div className="settings-column">
          
          <section className="settings-card">
            <div className="settings-card-header">
              <span className="sc-icon">🛡️</span>
              <h3 className="sc-title">Security & Account</h3>
            </div>
            
            <div className="settings-static-content">
              <p>You are logged into Smart Campus as:</p>
              <div className="static-account-box">
                <strong>{user?.name || 'User'}</strong>
                <span>{user?.email || 'N/A'}</span>
              </div>
              <p className="static-note">
                Because this system uses secure Google OAuth authentication, passwords and 
                two-factor authentication settings are managed directly by Google.
              </p>
            </div>

            <div className="settings-button-group">
              <button className="settings-action-btn edit-btn" onClick={() => navigate('/profile')}>
                View Public Profile
              </button>
              <button className="settings-action-btn danger-btn" onClick={handleLogout}>
                Sign Out Everywhere
              </button>
            </div>
          </section>

        </div>

      </div>
    </div>
  );
};

export default Shared_SettingsPage;
