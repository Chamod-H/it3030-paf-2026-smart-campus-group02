// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────

const VALID_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const VALID_STATUSES   = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED'];
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const MAX_ATTACHMENTS    = 3;
const MAX_FILE_SIZE_MB   = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const MIN_DESCRIPTION_LENGTH = 20;

// ─────────────────────────────────────────────
// validatePriority(priority)
// ─────────────────────────────────────────────

/**
 * Validates a priority string.
 * @param {string} priority
 * @returns {string|null} Error message or null if valid.
 */
export const validatePriority = (priority) => {
  if (!priority || !priority.trim()) return 'Priority is required.';
  if (!VALID_PRIORITIES.includes(priority.toUpperCase())) {
    return `Priority must be one of: ${VALID_PRIORITIES.join(', ')}.`;
  }
  return null;
};

// ─────────────────────────────────────────────
// validateStatus(status)
// ─────────────────────────────────────────────

/**
 * Validates a status transition value.
 * @param {string} status
 * @returns {string|null} Error message or null if valid.
 */
export const validateStatus = (status) => {
  if (!status || !status.trim()) return 'Status is required.';
  if (!VALID_STATUSES.includes(status.toUpperCase())) {
    return `Status must be one of: ${VALID_STATUSES.join(', ')}.`;
  }
  return null;
};

// ─────────────────────────────────────────────
// validateAttachments(files)
// ─────────────────────────────────────────────

/**
 * Validates an array of File objects for attachments.
 * @param {File[]} files
 * @returns {string|null} Error message or null if valid.
 */
export const validateAttachments = (files) => {
  if (!files || files.length === 0) return null; // attachments are optional

  if (files.length > MAX_ATTACHMENTS) {
    return `A maximum of ${MAX_ATTACHMENTS} images may be attached.`;
  }

  for (const file of files) {
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return `"${file.name}" is not an allowed file type. Only JPG, PNG, WebP, and GIF images are accepted.`;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return `"${file.name}" exceeds the ${MAX_FILE_SIZE_MB}MB size limit.`;
    }
  }

  return null;
};

// ─────────────────────────────────────────────
// validateTicketForm(formData)
// ─────────────────────────────────────────────

/**
 * Validates the full ticket creation / edit form.
 * @param {Object} formData - { resourceId, category, description, priority, contactDetails, attachments }
 * @returns {Object} errors - A map of field names to error messages. Empty object = valid.
 *
 * @example
 * const errors = validateTicketForm(formData);
 * if (Object.keys(errors).length > 0) { // show errors }
 */
export const validateTicketForm = (formData) => {
  const errors = {};

  // Resource / Location
  if (!formData.resourceId || !String(formData.resourceId).trim()) {
    errors.resourceId = 'Please select an affected resource or location.';
  }

  // Category
  if (!formData.category || !formData.category.trim()) {
    errors.category = 'Please select an issue category.';
  }

  // Description
  if (!formData.description || !formData.description.trim()) {
    errors.description = 'A description of the issue is required.';
  } else if (formData.description.trim().length < MIN_DESCRIPTION_LENGTH) {
    errors.description = `Description must be at least ${MIN_DESCRIPTION_LENGTH} characters.`;
  }

  // Priority
  const priorityError = validatePriority(formData.priority);
  if (priorityError) errors.priority = priorityError;

  // Contact Details — must be a 10-digit mobile number
  if (!formData.contactDetails || !formData.contactDetails.trim()) {
    errors.contactDetails = 'Mobile number cannot be empty.';
  } else if (!/^\d{10}$/.test(formData.contactDetails.trim())) {
    errors.contactDetails = 'Mobile number must be exactly 10 digits.';
  }

  // Attachments (optional but constrained)
  const attachmentError = validateAttachments(formData.attachments);
  if (attachmentError) errors.attachments = attachmentError;

  return errors;
};
