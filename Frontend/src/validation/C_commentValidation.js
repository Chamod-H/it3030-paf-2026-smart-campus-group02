// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────

const MIN_COMMENT_LENGTH = 3;
const MAX_COMMENT_LENGTH = 2000;

// ─────────────────────────────────────────────
// validateCommentLength(commentText)
// ─────────────────────────────────────────────

/**
 * Checks a comment string against minimum and maximum length bounds.
 * @param {string} commentText
 * @returns {string|null} Error message or null if valid.
 */
export const validateCommentLength = (commentText) => {
  const trimmed = (commentText || '').trim();

  if (trimmed.length < MIN_COMMENT_LENGTH) {
    return `Comment must be at least ${MIN_COMMENT_LENGTH} characters.`;
  }
  if (trimmed.length > MAX_COMMENT_LENGTH) {
    return `Comment must not exceed ${MAX_COMMENT_LENGTH} characters (currently ${trimmed.length}).`;
  }
  return null;
};

// ─────────────────────────────────────────────
// validateCommentForm(commentText)
// ─────────────────────────────────────────────

/**
 * Full validation for a comment submission.
 * Checks for empty, whitespace-only, and length bounds.
 * @param {string} commentText
 * @returns {Object} errors - { comment: string } or {} if valid.
 *
 * @example
 * const errors = validateCommentForm(text);
 * if (errors.comment) setErrors(errors);
 */
export const validateCommentForm = (commentText) => {
  const errors = {};
  const trimmed = (commentText || '').trim();

  // Empty or whitespace-only check
  if (!trimmed) {
    errors.comment = 'Comment cannot be empty.';
    return errors;
  }

  // Length bounds
  const lengthError = validateCommentLength(trimmed);
  if (lengthError) {
    errors.comment = lengthError;
  }

  return errors;
};
