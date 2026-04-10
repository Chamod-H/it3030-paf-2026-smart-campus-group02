import React from 'react';
import './Shared_ErrorMessage.css';

/**
 * Reusable Error Banner Component
 * Standardizes how errors are displayed across the platform, providing 
 * clear visual feedback, retry logic, and dismissal hooks.
 * 
 * @param {string} message - Primary error text explaining what went wrong
 * @param {function} onRetry - Function to trigger if user wants to attempt the failed action again
 * @param {function} onClose - Function to trigger to dismiss/hide the banner
 */
const Shared_ErrorMessage = ({ 
  message = "We encountered an unexpected error. Please try again.", 
  onRetry, 
  onClose 
}) => {
  
  // Failsafe rendering constraint
  if (!message) return null;

  return (
    <div className="shared-error-wrapper" role="alert">
      
      {/* Icon Indicator */}
      <div className="shared-error-icon" aria-hidden="true">
        ⚠️
      </div>
      
      {/* Text Content */}
      <div className="shared-error-body">
        <h4 className="shared-error-title">Houston, we have a problem</h4>
        <p className="shared-error-text">{message}</p>
      </div>
      
      {/* Action Bindings */}
      <div className="shared-error-actions">
        {onRetry && (
          <button 
            type="button" 
            className="shared-error-retry-btn" 
            onClick={onRetry}
          >
            Retry
          </button>
        )}
        
        {onClose && (
          <button 
            type="button" 
            className="shared-error-close-btn" 
            onClick={onClose}
            aria-label="Dismiss error message"
            title="Dismiss"
          >
            ✕
          </button>
        )}
      </div>
      
    </div>
  );
};

export default Shared_ErrorMessage;
