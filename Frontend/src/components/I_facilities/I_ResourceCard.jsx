import React from 'react';
import './I_ResourceCard.css';

const I_ResourceCard = ({ resource, onViewDetails, onQuickBook }) => {
  if (!resource) return null;

  const {
    name = "Unknown Resource",
    type = "General",
    capacity = "N/A",
    location = "Unknown",
    status = "OUT_OF_SERVICE",
    availabilitySummary = "Check availability",
    imageUrl
  } = resource;

  const defaultImage = '/campus-placeholder.png';
  const imageToUse = imageUrl || defaultImage;

  const isActive = status === 'ACTIVE';

  return (
    <div className="resource-card">
      <div className="rc-image-container">
        <img src={imageToUse} alt={name} className="rc-image" />
        <div className={`rc-status-badge ${isActive ? 'rc-status-active' : 'rc-status-inactive'}`}>
          {status.replace(/_/g, ' ')}
        </div>
      </div>
      <div className="rc-content">
        <h3 className="rc-title">{name}</h3>
        <p className="rc-type">{type}</p>
        
        <div className="rc-details">
          <div className="rc-detail-item">
            <span className="rc-detail-icon">📍</span>
            <span>{location}</span>
          </div>
          <div className="rc-detail-item">
            <span className="rc-detail-icon">👥</span>
            <span>Capacity: {capacity}</span>
          </div>
          <div className="rc-detail-item rc-availability">
            <span className="rc-detail-icon">🕒</span>
            <span>{availabilitySummary}</span>
          </div>
        </div>
      </div>
      
      <div className="rc-actions">
        <button 
          className="rc-btn rc-details-btn" 
          onClick={() => onViewDetails && onViewDetails(resource)}
        >
          View Details
        </button>
        {onQuickBook && isActive && (
          <button 
            className="rc-btn rc-book-btn" 
            onClick={() => onQuickBook(resource)}
          >
            Quick Book
          </button>
        )}
      </div>
    </div>
  );
};

export default I_ResourceCard;
