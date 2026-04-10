import React, { useState } from 'react';
import './I_ResourceDetailsPanel.css';

const I_ResourceDetailsPanel = ({ resource, onBook, onEdit, onBack }) => {
  if (!resource) return null;

  const defaultImage = '/campus-placeholder.png';
  const images = resource.imageGallery && resource.imageGallery.length > 0 
    ? resource.imageGallery 
    : [resource.imageUrl || defaultImage];
    
  const [activeImage, setActiveImage] = useState(images[0]);

  const {
    name = "Unknown Resource",
    description = "No description available for this resource.",
    type = "General",
    capacity = "N/A",
    quantity = "N/A",
    location = "Unknown",
    availabilityWindows = [],
    status = "OUT_OF_SERVICE",
    suitablePurposes = []
  } = resource;

  const isActive = status === 'ACTIVE';

  return (
    <div className="resource-details-panel">
      <div className="rdp-header-actions">
        {onBack && (
          <button className="rdp-btn-back" onClick={onBack}>
            ← Back to Results
          </button>
        )}
      </div>

      <div className="rdp-content">
        <div className="rdp-gallery-section">
          <div className="rdp-main-image-wrapper">
            <img src={activeImage} alt={name} className="rdp-main-image" />
            <div className={`rdp-status-badge ${isActive ? 'rdp-status-active' : 'rdp-status-inactive'}`}>
              {status.replace(/_/g, ' ')}
            </div>
          </div>
          
          {images.length > 1 && (
            <div className="rdp-thumbnails">
              {images.map((img, idx) => (
                <div 
                  key={idx} 
                  className={`rdp-thumbnail ${activeImage === img ? 'rdp-thumbnail-active' : ''}`}
                  onClick={() => setActiveImage(img)}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rdp-info-section">
          <div className="rdp-title-area">
            <span className="rdp-type">{type}</span>
            <h2 className="rdp-name">{name}</h2>
            <div className="rdp-location-capacity">
              <span className="rdp-meta-item">📍 {location}</span>
              <span className="rdp-meta-item">👥 {type === 'Equipment' ? 'Quantity: ' + (quantity ?? 'N/A') : 'Capacity: ' + (capacity ?? 'N/A')}</span>
            </div>
          </div>

          <div className="rdp-description">
            <h3>Description</h3>
            <p>{description}</p>
          </div>

          {suitablePurposes.length > 0 && (
            <div className="rdp-purposes">
              <h3>Suitable For</h3>
              <div className="rdp-tags">
                {suitablePurposes.map((purpose, idx) => (
                  <span key={idx} className="rdp-tag">{purpose}</span>
                ))}
              </div>
            </div>
          )}

          <div className="rdp-availability">
            <h3>Availability Windows</h3>
            {availabilityWindows && availabilityWindows.length > 0 ? (
              <ul className="rdp-windows-list">
                {availabilityWindows.map((window, idx) => (
                  <li key={idx} className="rdp-window-item">
                    <span className="rdp-window-day">{window.day || window.date}</span>
                    <span className="rdp-window-time">{window.startTime} - {window.endTime}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="rdp-no-av">Contact administration to verify exact availability hours.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default I_ResourceDetailsPanel;
