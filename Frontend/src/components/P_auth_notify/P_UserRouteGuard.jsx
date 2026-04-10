import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/P_AuthContext';

/**
 * Route guard that allows access to any authenticated user.
 * 
 * - If not logged in: Redirects to /login (saves location for post-login return).
 * - If logged in: Renders children.
 */
const P_UserRouteGuard = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Prevent flash of login screen during initial check
  if (loading) {
    return (
      <div className="p-auth-loading">
        <div className="p-auth-spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default P_UserRouteGuard;
