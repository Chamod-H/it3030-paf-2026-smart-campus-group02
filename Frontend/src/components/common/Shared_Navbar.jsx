import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/P_AuthContext';
import P_NotificationBell from '../P_auth_notify/P_NotificationBell';
import P_UserMenu from '../P_auth_notify/P_UserMenu';
import './Shared_Navbar.css';

/**
 * Global Top Navigation Bar
 * Handles routing, role-based link visibility, responsive mobile menu, 
 * and integrates the user identity and notification modules.
 */
const Shared_Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Hide navbar on pure authentication sequence pages
  const hideOnRoutes = ['/login', '/auth/callback'];
  if (hideOnRoutes.includes(location.pathname)) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Define navigation hierarchy with basic RBAC
  const navLinks = [
    { label: 'Dashboard', path: '/dashboard', roles: ['admin', 'student', 'technician'] },
    { label: 'Tickets', path: '/tickets', roles: ['admin', 'student', 'technician'] },
    { label: 'Admin Tools', path: '/admin/roles', roles: ['admin'] },
  ];

  // Safely filter links based on user role
  const userRole = user?.role?.toLowerCase() || 'student';
  const visibleLinks = navLinks.filter(link => link.roles.includes(userRole));

  return (
    <header className="shared-navbar">
      <div className="shared-nav-container">
        
        {/* Brand / Logo */}
        <div className="shared-nav-brand" onClick={() => navigate('/dashboard')}>
          <div className="shared-nav-logo-icon">SC</div>
          <span className="shared-nav-brand-text">Smart Campus</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="shared-nav-links desktop-only">
          {user && visibleLinks.map((link) => (
            <NavLink 
              key={link.path} 
              to={link.path} 
              className={({ isActive }) => isActive ? "shared-nav-link active" : "shared-nav-link"}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Right Actions Container */}
        <div className="shared-nav-actions">
          {user ? (
            <>
              <div className="shared-action-item">
                <P_NotificationBell />
              </div>
              <div className="shared-action-item">
                <P_UserMenu 
                  user={user} 
                  onLogout={handleLogout} 
                  onProfile={() => navigate('/profile/setup')}
                  onNotifications={() => navigate('/notifications')}
                />
              </div>
            </>
          ) : (
            <button className="shared-nav-login-btn" onClick={() => navigate('/login')}>
              Sign In
            </button>
          )}

          {/* Mobile Hamburger Toggle */}
          <button 
            className="shared-mobile-toggle" 
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle Navigation"
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="shared-mobile-drawer">
          <nav className="shared-mobile-nav">
            {user && visibleLinks.map((link) => (
              <NavLink 
                key={link.path} 
                to={link.path} 
                className={({ isActive }) => isActive ? "shared-mobile-link active" : "shared-mobile-link"}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
            {!user && (
              <div className="shared-mobile-link" onClick={() => { navigate('/login'); setMobileOpen(false); }}>
                Sign In
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Shared_Navbar;
