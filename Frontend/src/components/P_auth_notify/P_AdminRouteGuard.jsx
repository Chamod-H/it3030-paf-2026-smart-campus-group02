import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/P_AuthContext';

/**
 * Route guard that only allows access to users with the 'admin' role.
 * 
 * - If not logged in: Redirects to /login (memoizing the current location for post-login redirect).
 * - If logged in but not admin: Redirects to /unauthorized.
 * - If admin: Renders children.
 */
const P_AdminRouteGuard = ({ children }) => {
  const { user, isAuthenticated, loading, isAdmin } = useAuth();
  const location = useLocation();

  // Show nothing while checking initial auth state (prevents "flash" of login page)
  if (loading) {
    return (
      <div className="p-auth-loading">
        <div className="p-auth-spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login but save the current location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    // Logged in but not an admin
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default P_AdminRouteGuard;
