import React, { useState } from 'react';
import './T_BookingRejectModal.css';

/**
 * Modal to securely confirm booking rejections requiring a mandatory reason.
 * 
 * @param {boolean} isOpen - Controls modal visibility
 * @param {Object} booking - The booking object being rejected
 * @param {string} rejectReason - The text value for the rejection reason
 * @param {Function} setRejectReason - State setter for the rejection reason
 * @param {Function} onClose - Closes the modal without action
 * @param {Function} onConfirmReject - Confirms rejection, handles API submission
 */
const T_BookingRejectModal = ({
  isOpen,
  booking,
  rejectReason,
  setRejectReason,
  onClose,
  onConfirmReject
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !booking) return null;

  const handleConfirm = async () => {
    if (!rejectReason || !rejectReason.trim()) {
      setError('A rejection reason is mandatory.');
      return;
    }
    
    setError('');
    setIsProcessing(true);
    
    try {
      await onConfirmReject(booking.id);
      // Wait for parent handler to conclude the network request mapping
    } finally {
      setIsProcessing(false);
      setRejectReason(''); // Clear the reason upon success
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      setError('');
      setRejectReason('');
      onClose();
    }
  };

  return (
    <div className="t-modal-overlay" onClick={handleClose}>
      <div 
        className="t-reject-modal"
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="t-rm-header">
          <div className="t-rm-icon-container">
            <span className="t-rm-icon">❌</span>
          </div>
          <h2>Reject Booking Request</h2>
        </div>

        <div className="t-rm-body">
          <p className="t-rm-warning-text">
            You are about to reject the following booking request. The requester will be notified immediately. Please provide a clear reason below.
          </p>

          <div className="t-rm-summary-card">
            <div className="t-rm-summary-row">
              <span className="t-rm-label">Resource:</span>
              <span className="t-rm-value">{booking.resourceName}</span>
            </div>
            <div className="t-rm-summary-row">
              <span className="t-rm-label">Requester:</span>
              <span className="t-rm-value">{booking.requesterName}</span>
            </div>
            <div className="t-rm-summary-row">
              <span className="t-rm-label">Schedule:</span>
              <span className="t-rm-value">{booking.bookingDate} | {booking.startTime} - {booking.endTime}</span>
            </div>
          </div>

          <div className="t-rm-form-group">
            <label htmlFor="rejectReason">Rejection Reason <span className="t-rm-required">*</span></label>
            <textarea 
              id="rejectReason"
              value={rejectReason}
              onChange={(e) => {
                setRejectReason(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g., 'The Advanced IT Lab is strictly reserved for final-year projects over this weekend. Please select another lab.'"
              rows="4"
              className={error ? 't-rm-textarea-error' : ''}
            ></textarea>
            {error && <span className="t-rm-error-text">{error}</span>}
          </div>
        </div>

        <div className="t-rm-footer">
          <button 
            className="t-rm-btn t-rm-btn-cancel" 
            onClick={handleClose}
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button 
            className="t-rm-btn t-rm-btn-reject" 
            onClick={handleConfirm}
            disabled={isProcessing}
          >
            {isProcessing ? 'Rejecting...' : 'Confirm Rejection'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default T_BookingRejectModal;
