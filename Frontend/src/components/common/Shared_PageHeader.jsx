import React from 'react';
import { Link } from 'react-router-dom';
import './Shared_PageHeader.css';

/**
 * Reusable Page Header Component
 * Provides a highly consistent title area across all system modules.
 * 
 * @param {string} title - Main page heading (required)
 * @param {string} subtitle - Secondary descriptive text (optional)
 * @param {React.ReactNode} actions - Container for buttons (like "Create New") (optional)
 * @param {Array<{label: string, path: string}>} breadcrumbs - Path array for navigation (optional)
 */
const Shared_PageHeader = ({ title, subtitle, actions, breadcrumbs }) => {
  return (
    <div className="shared-page-header">
      
      {/* Optional Breadcrumbs Navigation */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="shared-breadcrumbs" aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, index) => (
            <span key={index} className="breadcrumb-item">
              {crumb.path ? (
                <Link to={crumb.path} className="breadcrumb-link">{crumb.label}</Link>
              ) : (
                <span className="breadcrumb-current" aria-current="page">{crumb.label}</span>
              )}
              
              {/* Add separator if not the last item */}
              {index < breadcrumbs.length - 1 && (
                <span className="breadcrumb-separator">/</span>
              )}
            </span>
          ))}
        </nav>
      )}

      {/* Main Title and Actions Flexbox */}
      <div className="shared-header-content">
        <div className="shared-header-titles">
          <h1 className="shared-page-title">{title}</h1>
          {subtitle && <p className="shared-page-subtitle">{subtitle}</p>}
        </div>
        
        {/* Optional Action Controls Area */}
        {actions && (
          <div className="shared-header-actions">
            {actions}
          </div>
        )}
      </div>

    </div>
  );
};

export default Shared_PageHeader;
