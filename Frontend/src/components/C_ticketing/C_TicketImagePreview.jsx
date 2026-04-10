import React, { useState, useEffect } from 'react';
import './C_TicketImagePreview.css';

/**
 * Universal component for rendering small thumbnails of incident attachments.
 * Built-in native lightbox support for enlarged viewing.
 */
const C_TicketImagePreview = ({
  images = [],
  editable = false,
  onRemove
}) => {
  const [enlargedImage, setEnlargedImage] = useState(null);

  useEffect(() => {
    return () => {
      if (enlargedImage && enlargedImage.startsWith('blob:')) {
        URL.revokeObjectURL(enlargedImage);
      }
    };
  }, [enlargedImage]);

  const getImageUrl = (img) => {
    if (!img) return '';
    if (typeof img === 'string') return img;
    try {
      return URL.createObjectURL(img);
    } catch (err) {
      return '';
    }
  };

  const handleEnlarge = (img) => {
    setEnlargedImage(getImageUrl(img));
  };

  const closeLightbox = () => {
    setEnlargedImage(null);
  };

  if (!images || images.length === 0) {
    return (
      <div className="c-tip-placeholder">
        <span className="c-tip-placeholder-icon">🖼️</span>
        <p>No attachments provided for this incident.</p>
      </div>
    );
  }

  return (
    <div className="c-ticket-image-preview-wrapper">
      <div className="c-tip-grid">
        {images.map((img, idx) => (
          <div key={idx} className="c-tip-thumbnail-card">
            <img 
              src={getImageUrl(img)} 
              alt={`Incident attachment thumbnail ${idx + 1}`} 
              onClick={() => handleEnlarge(img)}
              className="c-tip-thumbnail-img"
            />
            {editable && onRemove && (
              <button 
                type="button" 
                className="c-tip-remove-btn" 
                onClick={(e) => { e.stopPropagation(); onRemove(idx); }}
                title="Remove attachment"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>

      {enlargedImage && (
        <div className="c-tip-lightbox-overlay" onClick={closeLightbox}>
          <div className="c-tip-lightbox-content" onClick={e => e.stopPropagation()}>
            <button className="c-tip-lightbox-close" onClick={closeLightbox}>×</button>
            <img src={enlargedImage} alt="Enlarged incident attachment" className="c-tip-lightbox-img" />
          </div>
        </div>
      )}
    </div>
  );
};

export default C_TicketImagePreview;
