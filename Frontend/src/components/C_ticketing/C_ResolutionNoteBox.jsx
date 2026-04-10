import React from 'react';
import './C_ResolutionNoteBox.css';

/**
 * Component for adding or displaying a resolution note on a ticket.
 * Renders an editable form when `editable=true`, or a read-only summary when resolved.
 */
const C_ResolutionNoteBox = ({
  resolutionNote,
  setResolutionNote,
  onSave,
  editable = false,
  resolvedBy,
  resolvedAt
}) => {
  // Read-only resolved state
  if (!editable) {
    return (
      <div className="c-rnb-wrapper c-rnb-resolved">
        <div className="c-rnb-header">
          <span className="c-rnb-icon">✅</span>
          <div className="c-rnb-title-block">
            <h4>Resolution Notes</h4>
            {(resolvedBy || resolvedAt) && (
              <span className="c-rnb-meta">
                {resolvedBy && `Resolved by ${resolvedBy}`}
                {resolvedBy && resolvedAt && ' · '}
                {resolvedAt && resolvedAt}
              </span>
            )}
          </div>
        </div>
        <div className="c-rnb-note-display">
          {resolutionNote
            ? <p>{resolutionNote}</p>
            : <p className="c-rnb-empty">No resolution notes were recorded.</p>
          }
        </div>
      </div>
    );
  }

  // Editable state for technicians/admins
  return (
    <div className="c-rnb-wrapper c-rnb-editable">
      <div className="c-rnb-header">
        <span className="c-rnb-icon">📝</span>
        <div className="c-rnb-title-block">
          <h4>Add Resolution Notes</h4>
          <span className="c-rnb-meta">Describe the fix applied before marking this ticket as resolved</span>
        </div>
      </div>

      <textarea
        className="c-rnb-textarea"
        value={resolutionNote || ''}
        onChange={(e) => setResolutionNote && setResolutionNote(e.target.value)}
        rows={4}
        placeholder="Describe what was done to resolve the issue..."
      />

      <div className="c-rnb-actions">
        <button
          className="c-rnb-save-btn"
          onClick={() => onSave && onSave(resolutionNote)}
          disabled={!resolutionNote || !resolutionNote.trim()}
        >
          Save & Mark Resolved
        </button>
      </div>
    </div>
  );
};

export default C_ResolutionNoteBox;
