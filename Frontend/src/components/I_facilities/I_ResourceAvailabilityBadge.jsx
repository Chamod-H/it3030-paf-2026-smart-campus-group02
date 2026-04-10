import React from 'react';
import './I_ResourceAvailabilityBadge.css';

const I_ResourceAvailabilityBadge = ({ availability = 'AVAILABLE', status = 'ACTIVE' }) => {
  // If the resource is out of service, that overrides normal availability
  if (status === 'OUT_OF_SERVICE') {
    return (
      <span className="rab-badge rab-out-of-service">
        <span className="rab-dot"></span>
        Out of service
      </span>
    );
  }

  // Determine appearance based on availability prop
  const avUpper = availability.toUpperCase();
  
  let badgeClass = 'rab-unavailable';
  let label = 'Unavailable';
  
  if (avUpper === 'AVAILABLE') {
    badgeClass = 'rab-available';
    label = 'Available';
  } else if (avUpper === 'LIMITED') {
    badgeClass = 'rab-limited';
    label = 'Limited';
  } else if (avUpper === 'UNAVAILABLE') {
    badgeClass = 'rab-unavailable';
    label = 'Unavailable';
  } else {
    // Fallback if an unexpected string is passed
    badgeClass = 'rab-default';
    label = availability.charAt(0).toUpperCase() + availability.slice(1).toLowerCase();
  }

  return (
    <span className={`rab-badge ${badgeClass}`}>
      <span className="rab-dot"></span>
      {label}
    </span>
  );
};

export default I_ResourceAvailabilityBadge;
