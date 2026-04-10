import React from 'react';
import './Shared_LoadingSpinner.css';

/**
 * Reusable Loading Spinner Component
 * Displays an animated CSS spinner to indicate background processing or API fetches.
 * 
 * @param {string} text - Optional context text (e.g., "Authenticating...")
 * @param {boolean} fullscreen - If true, overlays the entire viewport with a semi-transparent backdrop
 * @param {string} size - 'small', 'medium', or 'large' to control the circle dimensions
 */
const Shared_LoadingSpinner = ({ 
  text, 
  fullscreen = false, 
  size = 'medium' 
}) => {
  
  const spinnerContent = (
    <div className={`shared-loading-content size-${size}`}>
      <div className="shared-spinner" role="status" aria-label="Loading">
        <div className="shared-spinner-ring"></div>
      </div>
      {text && <p className="shared-loading-text">{text}</p>}
    </div>
  );

  // If fullscreen, wrap the content in a fixed position overlay
  if (fullscreen) {
    return (
      <div className="shared-loading-fullscreen">
        {spinnerContent}
      </div>
    );
  }

  // Otherwise, return inline block for embedding securely within natural flow
  return spinnerContent;
};

export default Shared_LoadingSpinner;
