import React, { useEffect } from 'react';
import './Shared_ConfirmModal.css';

/**
 * Reusable Confirmation Modal Component
 * Standard dialog to intercept destructive or consequential actions (e.g., deletions, role changes)
 * and force explicit user confirmation.
 * 
 * @param {boolean} isOpen - Controls the visibility of the modal and overlay
 * @param {string} title - The header text indicating the action context
 * @param {string} message - The contextual explanation of the consequence
 * @param {string} confirmLabel - Custom text for the confirm button (defaults to "Confirm")
 * @param {string} cancelLabel - Custom text for the cancel button (defaults to "Cancel")
 * @param {boolean} isDanger - If true, visually styles the confirm button as a destructive action (Red)
 * @param {function} onConfirm - Callback fired when the user explicitly agrees
 * @param {function} onClose - Callback fired when the user cancels, clicks away, or hits Escape
 */
const Shared_ConfirmModal = ({ 
  isOpen, 
  title = "Confirm Action", 
  message = "Are you sure you want to proceed with this action?",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isDanger = false,
  onConfirm, 
  onClose 
}) => {
  
  // Accessibility & UX: Close modal when pressing the Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    
    // Prevent background scrolling while modal is open
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Prevent rendering if state is closed
  if (!isOpen) return null;

  return (
    <div 
      className="shared-modal-overlay" 
      onClick={onClose} 
      role="dialog" 
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className="shared-modal-container" 
        onClick={(e) => e.stopPropagation()} // Prevent overlay click from closing when clicking inside modal
      >
        
        {/* Header Segment */}
        <div className="shared-modal-header">
          <h3 id="modal-title" className="shared-modal-title">{title}</h3>
          <button 
            type="button"
            className="shared-modal-close-icon" 
            onClick={onClose} 
            aria-label="Close confirmation dialog"
          >
            ✕
          </button>
        </div>

        {/* Body Segment */}
        <div className="shared-modal-body">
          <p className="shared-modal-message">{message}</p>
        </div>

        {/* Footer Actions */}
        <div className="shared-modal-footer">
          <button 
            type="button"
            className="shared-modal-btn shared-modal-cancel" 
            onClick={onClose}
          >
            {cancelLabel}
          </button>
          
          <button 
            type="button"
            className={`shared-modal-btn shared-modal-confirm ${isDanger ? 'btn-danger' : 'btn-primary'}`} 
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Shared_ConfirmModal;
