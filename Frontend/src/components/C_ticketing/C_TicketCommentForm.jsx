import React from 'react';
import './C_TicketCommentForm.css';

/**
 * Reusable form for adding a new comment or editing an existing one on a ticket thread.
 */
const C_TicketCommentForm = ({
  value,
  setValue,
  onSubmit,
  onCancel,
  mode = 'add',
  errors = {}
}) => {
  const isEditMode = mode === 'edit';

  const handleKeyDown = (e) => {
    // Ctrl+Enter submits naturally for power users
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      onSubmit && onSubmit();
    }
  };

  return (
    <div className="c-ticket-comment-form">
      <div className="c-tcf-header">
        <span className="c-tcf-title">
          {isEditMode ? '✏️ Edit Comment' : '💬 Add a Comment'}
        </span>
        {!isEditMode && (
          <span className="c-tcf-hint">Tip: Press Ctrl+Enter to submit</span>
        )}
      </div>

      <textarea
        className={`c-tcf-textarea ${errors.comment ? 'c-tcf-error-input' : ''}`}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Write your comment here..."
        rows={4}
      />

      {errors.comment && (
        <span className="c-tcf-error-text">⚠️ {errors.comment}</span>
      )}

      <div className="c-tcf-actions">
        {isEditMode && onCancel && (
          <button type="button" className="c-tcf-btn-cancel" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button
          type="button"
          className="c-tcf-btn-submit"
          onClick={() => onSubmit && onSubmit()}
          disabled={!value || !value.trim()}
        >
          {isEditMode ? 'Save Changes' : 'Post Comment'}
        </button>
      </div>
    </div>
  );
};

export default C_TicketCommentForm;
