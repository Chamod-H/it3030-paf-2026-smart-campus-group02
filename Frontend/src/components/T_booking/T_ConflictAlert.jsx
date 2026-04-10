import React from 'react';
import './T_ConflictAlert.css';

/**
 * Renders a specialized alert explaining a booking slot collision.
 * 
 * @param {boolean} conflict - Controls visibility of the alert
 * @param {string} message - Primary conflict explanation
 * @param {Object} details - Extraneous collision data (e.g., { existingBookingId, existingTime })
 */
const T_ConflictAlert = ({
  conflict,
  message,
  details
}) => {
  if (!conflict) return null;

  return (
    <div className="t-conflict-alert-box">
      <div className="t-ca-icon-wrapper">
        <span className="t-ca-icon">⚠️</span>
      </div>
      <div className="t-ca-content">
        <h4 className="t-ca-title">Schedule Conflict Detected</h4>
        <p className="t-ca-message">{message || 'This resource is already booked during your selected time frame.'}</p>
        
        {details && (
          <div className="t-ca-details">
            <strong>Conflicting Block: </strong>
            {details.existingTime || 'Unknown Time'} 
            {details.existingBookingId && ` (Ref: ${details.existingBookingId})`}
          </div>
        )}
        
        <p className="t-ca-suggestion">
          💡 Please modify your start and end times, or return to the Catalogue to select an alternate facility.
        </p>
      </div>
    </div>
  );
};

export default T_ConflictAlert;
