import React from 'react';
import { useNavigate } from 'react-router-dom';
import './P_UnauthorizedPage.css';

/**
 * High-visibility "Access Denied" page.
 * Shown when users fail a role-based security guard.
 */
const P_UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="p-unauthorized-page">
      <div className="p-ua-card">
        <div className="p-ua-icon-circle">
          <span className="p-ua-emoji" role="img" aria-label="Locked">🚫</span>
        </div>
        
        <h1 className="p-ua-title">Access Denied</h1>
        <p className="p-ua-message">
          Oops! It looks like you don't have the necessary permissions to view this page. 
          Please contact your administrator if you believe this is an error.
        </p>

        <div className="p-ua-actions">
          <button 
            className="p-ua-btn p-ua-btn-primary" 
            onClick={() => navigate('/dashboard')}
          >
            🏠 Back to Dashboard
          </button>
          
          <button 
            className="p-ua-btn p-ua-btn-outline" 
            onClick={() => navigate('/login')}
          >
            🔑 Switch Account
          </button>
        </div>

        <div className="p-ua-footer">
          <p>Logged in as: <strong>{JSON.parse(localStorage.getItem('smart_campus_user'))?.email || 'Unknown'}</strong></p>
        </div>
      </div>
    </div>
  );
};

export default P_UnauthorizedPage;
