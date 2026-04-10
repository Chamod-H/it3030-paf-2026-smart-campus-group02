import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/P_AuthContext';
import './P_OAuthCallbackPage.css';

/**
 * Handles the redirect from Google OAuth.
 * Extracts tokens/codes and synchronizes session state.
 */
const P_OAuthCallbackPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, fetchCurrentUser } = useAuth();
  const [status, setStatus] = useState('processing'); // 'processing' | 'error'

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get('token'); // or 'code' depending on backend setup
      
      if (!token) {
        setStatus('error');
        return;
      }

      try {
        // 1. Save token
        localStorage.setItem('smart_campus_token', token);
        
        // 2. Fetch full user details using the new token
        await fetchCurrentUser(token);

        // 3. Determine where to redirect
        // Check if there was a "from" location saved in state before the login redirect
        const from = location.state?.from?.pathname || '/dashboard';
        
        // Success: Redirect to destination
        navigate(from, { replace: true });
      } catch (err) {
        console.error('OAuth sync failed:', err);
        setStatus('error');
      }
    };

    handleCallback();
  }, [location, navigate, fetchCurrentUser]);

  if (status === 'error') {
    return (
      <div className="p-callback-page error">
        <div className="p-callback-card">
          <span className="p-callback-icon">❌</span>
          <h2>Authentication Failed</h2>
          <p>We couldn't verify your Google account. Please try signing in again.</p>
          <button onClick={() => navigate('/login')} className="p-retry-btn">
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-callback-page">
      <div className="p-callback-card">
        <div className="p-callback-loader"></div>
        <h2>Finalizing Sign-in</h2>
        <p>Please wait while we sync your campus profile...</p>
      </div>
    </div>
  );
};

export default P_OAuthCallbackPage;
