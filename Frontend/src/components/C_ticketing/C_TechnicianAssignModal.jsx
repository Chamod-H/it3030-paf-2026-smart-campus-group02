import React, { useState } from 'react';
import './C_TechnicianAssignModal.css';

/**
 * Admin modal for assigning a technician to a maintenance ticket.
 */
const C_TechnicianAssignModal = ({
  isOpen,
  ticket,
  technicians = [],
  selectedTechnician,
  setSelectedTechnician,
  onClose,
  onConfirm
}) => {
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !ticket) return null;

  const handleConfirm = () => {
    if (!selectedTechnician) {
      setError('Please select a technician before confirming.');
      return;
    }
    setError('');
    onConfirm && onConfirm({ technicianId: selectedTechnician, note });
  };

  const handleClose = () => {
    setError('');
    setNote('');
    onClose && onClose();
  };

  return (
    <div className="c-tam-overlay" onClick={handleClose}>
      <div className="c-tam-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="c-tam-header">
          <h2>🔧 Assign Technician</h2>
          <button className="c-tam-close-btn" onClick={handleClose}>×</button>
        </div>

        {/* Ticket Summary */}
        <div className="c-tam-ticket-summary">
          <div className="c-tam-summary-row">
            <span className="c-tam-summary-label">Ticket ID</span>
            <span className="c-tam-summary-value c-tam-mono">{ticket.id}</span>
          </div>
          <div className="c-tam-summary-row">
            <span className="c-tam-summary-label">Location</span>
            <span className="c-tam-summary-value">{ticket.resourceName || ticket.location}</span>
          </div>
          <div className="c-tam-summary-row">
            <span className="c-tam-summary-label">Category</span>
            <span className="c-tam-summary-value">{ticket.category}</span>
          </div>
          <div className="c-tam-summary-row">
            <span className="c-tam-summary-label">Priority</span>
            <span className={`c-tam-priority c-tam-pri-${ticket.priority?.toLowerCase()}`}>
              {ticket.priority}
            </span>
          </div>
        </div>

        {/* Technician Dropdown */}
        <div className="c-tam-field">
          <label htmlFor="techSelect">Select Technician <span className="c-tam-required">*</span></label>
          <select
            id="techSelect"
            value={selectedTechnician || ''}
            onChange={(e) => {
              setSelectedTechnician(e.target.value);
              setError('');
            }}
            className={error ? 'c-tam-error-input' : ''}
          >
            <option value="">-- Choose a Technician --</option>
            {technicians.map(tech => (
              <option key={tech.id} value={tech.id}>
                {tech.name} {tech.specialization ? `(${tech.specialization})` : ''}
              </option>
            ))}
          </select>
          {error && <span className="c-tam-error-text">⚠️ {error}</span>}
        </div>

        {/* Optional Note */}
        <div className="c-tam-field">
          <label htmlFor="assignNote">Assignment Note <span className="c-tam-optional">(Optional)</span></label>
          <textarea
            id="assignNote"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="Add any special instructions for the technician..."
          />
        </div>

        {/* Actions */}
        <div className="c-tam-actions">
          <button className="c-tam-btn-cancel" onClick={handleClose}>Cancel</button>
          <button className="c-tam-btn-confirm" onClick={handleConfirm}>Confirm Assignment</button>
        </div>
      </div>
    </div>
  );
};

export default C_TechnicianAssignModal;
