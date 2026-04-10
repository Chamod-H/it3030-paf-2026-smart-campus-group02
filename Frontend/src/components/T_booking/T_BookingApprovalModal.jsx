import React, { useState } from 'react';
import './T_BookingApprovalModal.css';

/**
 * Modal to securely confirm booking approvals with optional administrative notes.
 * 
 * @param {boolean} isOpen - Controls modal visibility
 * @param {Object} booking - The booking object being approved
 * @param {Function} onClose - Closes the modal without action
 * @param {Function} onConfirm - Confirms approval, passing { bookingId, adminNote }
 */
const T_BookingApprovalModal = ({
  isOpen,
  booking,
  onClose,
  onConfirm
}) => {
  const [adminNote, setAdminNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !booking) return null;

  const handleConfirm = async () => {
    setIsProcessing(true);
    // Send back the booking ID and the specific note attached to this approval
    await onConfirm({
      bookingId: booking.id,
      adminNote: adminNote.trim()
    });
    setIsProcessing(false);
    setAdminNote(''); // Reset memory on success
  };

  const handleClose = () => {
    if (!isProcessing) {
      setAdminNote('');
      onClose();
    }
  };

  return (
    <div className="t-modal-overlay" onClick={handleClose}>
      <div 
        className="t-approval-modal"
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="t-am-header">
          <div className="t-am-icon-container">
            <span className="t-am-icon">✅</span>
          </div>
          <h2>Approve Booking Request</h2>
        </div>

        <div className="t-am-body">
          <p className="t-am-warning-text">
            You are about to officially approve the following booking. Once approved, the requester will be notified and the time slot will be permanently locked.
          </p>

          <div className="t-am-summary-card">
            <div className="t-am-summary-row">
              <span className="t-am-label">Resource:</span>
              <span className="t-am-value">{booking.resourceName}</span>
            </div>
            <div className="t-am-summary-row">
              <span className="t-am-label">Requester:</span>
              <span className="t-am-value">{booking.requesterName}</span>
            </div>
            <div className="t-am-summary-row">
              <span className="t-am-label">Schedule:</span>
              <span className="t-am-value">{booking.bookingDate} | {booking.startTime} - {booking.endTime}</span>
            </div>
          </div>

          <div className="t-am-form-group">
            <label htmlFor="adminNote">Admin Note (Optional)</label>
            <textarea 
              id="adminNote"
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="e.g., 'AV equipment must be returned manually by 5 PM.' This will be visible to the user."
              rows="3"
            ></textarea>
          </div>
        </div>

        <div className="t-am-footer">
          <button 
            className="t-am-btn t-am-btn-cancel" 
            onClick={handleClose}
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button 
            className="t-am-btn t-am-btn-confirm" 
            onClick={handleConfirm}
            disabled={isProcessing}
          >
            {isProcessing ? 'Approving...' : 'Confirm Approval'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default T_BookingApprovalModal;
