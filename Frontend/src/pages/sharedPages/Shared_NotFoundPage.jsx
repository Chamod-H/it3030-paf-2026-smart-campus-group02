import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/P_AuthContext';
import './Shared_NotFoundPage.css';

/**
 * Global 404 Not Found Page
 * Catches any invalid or non-existent routes entered by the user
 * and provides safe exit paths back to known application state.
 */
const Shared_NotFoundPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="shared-not-found-page">
      <div className="not-found-container">
        <div className="not-found-hero">
          <h1 className="error-code">404</h1>
          <div className="error-icon">🧭</div>
        </div>
        
        <h2 className="error-title">Looks like you're lost on campus</h2>
        <p className="error-desc">
          We can't seem to find the page you're looking for. The link may be broken, 
          or the page might have been removed.
        </p>

        <div className="not-found-actions">
          <button 
            className="nf-btn primary-run" 
            onClick={() => navigate(isAuthenticated ? '/dashboard' : '/')}
          >
            {isAuthenticated ? 'Return to Dashboard' : 'Go to Homepage'}
          </button>
          
          <button 
            className="nf-btn secondary-run" 
            onClick={() => navigate(-1)}
          >
            Go Back Previous
          </button>
        </div>
      </div>
    </div>
  );
};

export default Shared_NotFoundPage;
