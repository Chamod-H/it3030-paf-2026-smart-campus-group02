import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/P_AuthContext';
import Shared_LoadingSpinner from './Shared_LoadingSpinner';

/**
 * Universal Protected Route Wrapper (Higher-Order Component)
 * Provides comprehensive security for any module in the Smart Campus System.
 * Handles synchronous validation, loading sequences, and declarative role-based routing.
 * 
 * @param {React.ReactNode} children - The target screen/component to render if allowed
 * @param {Array<string>} [allowedRoles] - Specific roles allowed to view this route (Optional)
 */
const Shared_ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Phase 1: Context resolution
  // Wait until the global Auth Context resolves session persistence to avoid premature redirects
  if (loading) {
    return <Shared_LoadingSpinner fullscreen={true} text="Verifying session..." size="large" />;
  }

  // Phase 2: Authentication Challenge
  // If the system concludes there is no active session context, halt and redirect.
  if (!isAuthenticated || !user) {
    // Preserve the intent URL in browser state so they can be redirected back after logging in
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Phase 3: Authorization Strategy (Role-Based Access Control)
  // If the route explicitly demands certain user classes, verify the payload.
  if (allowedRoles && allowedRoles.length > 0) {
    const activeRole = user.role ? user.role.toLowerCase() : null;
    
    // If the user's role does not intersect with the allowed list, reject access.
    if (!activeRole || !allowedRoles.includes(activeRole)) {
      // Instead of forcing a logout, push them to a dedicated fallback page
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Phase 4: Resolution
  // The user has cleared all security checkpoints. Eject the protected UI.
  return children;
};

export default Shared_ProtectedRoute;
