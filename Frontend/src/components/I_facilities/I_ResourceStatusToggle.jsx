import React, { useState } from 'react';
import './I_ResourceStatusToggle.css';

const I_ResourceStatusToggle = ({ resourceId, currentStatus = 'ACTIVE', onStatusChange }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);

  const isActive = currentStatus === 'ACTIVE';

  const handleToggleClick = () => {
    const newStatus = isActive ? 'OUT_OF_SERVICE' : 'ACTIVE';
    setPendingStatus(newStatus);
    setShowConfirm(true);
  };

  const confirmChange = async () => {
    setShowConfirm(false);
    setIsUpdating(true);
    
    try {
      // If onStatusChange is async, await it
      if (onStatusChange) {
        await onStatusChange(resourceId, pendingStatus);
      } else {
        // Fallback simulate backend delay
        await new Promise(resolve => setTimeout(resolve, 800));
        console.log(`Status for ${resourceId} changed to ${pendingStatus}`);
      }
    } catch (error) {
      console.error("Failed to update status", error);
    } finally {
      setIsUpdating(false);
      setPendingStatus(null);
    }
  };

  const cancelChange = () => {
    setShowConfirm(false);
    setPendingStatus(null);
  };

  return (
    <div className="rst-container">
      <div 
        className={`rst-toggle-wrapper ${isActive ? 'rst-active' : 'rst-inactive'} ${isUpdating ? 'rst-disabled' : ''}`}
        onClick={!isUpdating ? handleToggleClick : undefined}
        title={isActive ? "Mark Out of Service" : "Mark Active"}
      >
        <div className="rst-track">
          <div className="rst-thumb">
            {isUpdating ? (
              <span className="rst-spinner"></span>
            ) : isActive ? (
              <span className="rst-icon">✓</span>
            ) : (
              <span className="rst-icon">✕</span>
            )}
          </div>
        </div>
        <span className="rst-label">
          {isActive ? 'Active' : 'Out of Service'}
        </span>
      </div>

      {showConfirm && (
        <div className="rst-confirm-overlay">
          <div className="rst-confirm-modal">
            <h4>Confirm Status Change</h4>
            <p>
              Are you sure you want to mark this resource as <strong>{pendingStatus.replace(/_/g, ' ')}</strong>?
            </p>
            {pendingStatus === 'OUT_OF_SERVICE' && (
              <p className="rst-warning">Users will not be able to book this resource until it is active again.</p>
            )}
            <div className="rst-confirm-actions">
              <button className="rst-btn rst-btn-cancel" onClick={cancelChange}>Cancel</button>
              <button className="rst-btn rst-btn-confirm" onClick={confirmChange}>Yes, Change Status</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default I_ResourceStatusToggle;
