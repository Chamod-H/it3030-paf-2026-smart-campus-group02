import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Shared_Footer.css';

/**
 * Global Footer Component
 * Provides standard site-wide links, system branding, and copyright info.
 */
const Shared_Footer = () => {
  const location = useLocation();

  // Hide footer on authentication sequences to maintain focus
  const hideOnRoutes = ['/login', '/auth/callback', '/unauthorized', '/profile/setup'];
  if (hideOnRoutes.includes(location.pathname)) {
    return null;
  }

  return (
    <footer className="shared-footer">
      <div className="shared-footer-container">
        
        {/* Brand & Info */}
        <div className="shared-footer-section brand-section">
          <div className="shared-footer-logo">
            <span className="logo-icon">SC</span>
            <span className="logo-text">Smart Campus</span>
          </div>
          <p className="shared-footer-desc">
            An integrated digital environment for modern educational institutions. 
            Streamlining facilities, bookings, and reporting.
          </p>
        </div>

        {/* Quick Links */}
        <div className="shared-footer-section">
          <h4 className="footer-heading">Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/dashboard">Dashboard</Link></li>
            
            
            <li><Link to="/tickets/new">Report an Issue</Link></li>
          </ul>
        </div>

        {/* Support & Contact */}
        <div className="shared-footer-section">
          <h4 className="footer-heading">Support</h4>
          <ul className="footer-links">
            <li><a href="mailto:support@smartcampus.edu">Contact IT Helpdesk</a></li>
            <li><a href="#faq">FAQ & Guides</a></li>
            <li><Link to="/profile">My Account</Link></li>
            <li><a href="#terms">Terms of Service</a></li>
          </ul>
          <div className="footer-contact-info">
            <p>IT Desk: +94 11 234 5678</p>
            <p>Emergency: Ext 911</p>
          </div>
        </div>

      </div>

      <div className="shared-footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} Smart Campus System Group 02. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Shared_Footer;
