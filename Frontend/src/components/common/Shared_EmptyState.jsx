import React from 'react';
import './Shared_EmptyState.css';

/**
 * Global Empty State Component
 * Provides a user-friendly visual placeholder when tables, lists, or queries 
 * result in zero items. Prevents users from thinking the module is broken.
 * 
 * @param {string|React.ReactNode} icon - Visual element to center attention (defaults to a box).
 * @param {string} title - The primary header explaining the state.
 * @param {string} message - Contextual explanation or what the user can do next.
 * @param {string} actionLabel - Text for the optional Call-To-Action button.
 * @param {function} onAction - Function triggered when the CTA is clicked.
 */
const Shared_EmptyState = ({ 
  icon = "📭", 
  title = "No items found", 
  message = "It looks like there's nothing to display here right now.", 
  actionLabel, 
  onAction 
}) => {
  return (
    <div className="shared-empty-state-container">
      <div className="shared-empty-state-content">
        
        {/* Visual Anchor */}
        <div className="shared-empty-state-icon">
          {icon}
        </div>
        
        {/* Text Context */}
        <h3 className="shared-empty-state-title">
          {title}
        </h3>
        <p className="shared-empty-state-message">
          {message}
        </p>
        
        {/* Optional Action Escalation */}
        {actionLabel && onAction && (
          <button 
            type="button" 
            className="shared-empty-state-btn"
            onClick={onAction}
          >
            {actionLabel}
          </button>
        )}
        
      </div>
    </div>
  );
};

export default Shared_EmptyState;
