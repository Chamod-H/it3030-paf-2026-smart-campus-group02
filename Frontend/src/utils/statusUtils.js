/**
 * Status Utility Library
 * Centralizes the mapping of backend enumeration variables (e.g. 'IN_PROGRESS', 'PENDING') 
 * into readable UI labels, CSS classes, and workflow workflow stages across all modules.
 */

// Central Configuration Dictionary mapping raw backend flags to UI implementations
const STATUS_CONFIG = {
  
  // ── Ticket Statuses ──
  OPEN:         { label: 'Open',            styleClass: 'status-warning', stage: 1 },
  IN_PROGRESS:  { label: 'In Progress',     styleClass: 'status-info',    stage: 2 },
  RESOLVED:     { label: 'Resolved',        styleClass: 'status-success', stage: 3 },
  CLOSED:       { label: 'Closed',          styleClass: 'status-neutral', stage: 4 },
  
  // ── Booking Statuses ──
  PENDING:      { label: 'Pending Review',  styleClass: 'status-warning', stage: 1 },
  APPROVED:     { label: 'Approved',        styleClass: 'status-success', stage: 2 },
  REJECTED:     { label: 'Rejected',        styleClass: 'status-danger',  stage: 3 },
  CANCELLED:    { label: 'Cancelled',       styleClass: 'status-neutral', stage: 3 },
  
  // ── Facility Statuses ──
  AVAILABLE:    { label: 'Available',       styleClass: 'status-success', stage: 1 },
  MAINTENANCE:  { label: 'Under Repair',    styleClass: 'status-warning', stage: 2 },
  UNAVAILABLE:  { label: 'Unavailable',     styleClass: 'status-danger',  stage: 3 },

  // Fallback
  UNKNOWN:      { label: 'Unknown State',   styleClass: 'status-neutral', stage: 0 }
};

export const STATUSES = Object.keys(STATUS_CONFIG);

/**
 * Normalizes a raw string to guarantee it matches a system key safely.
 * Ex: "in progress" -> "IN_PROGRESS"
 * 
 * @param {string} rawStatus 
 * @returns {string} Highly normalized status key
 */
export const normalizeStatus = (rawStatus) => {
  if (!rawStatus) return 'UNKNOWN';
  const clean = String(rawStatus).toUpperCase().trim().replace(/ /g, '_');
  return STATUS_CONFIG[clean] ? clean : 'UNKNOWN';
};

/**
 * Retrieves the beautiful, user-facing readable label.
 * 
 * @param {string} rawStatus 
 * @returns {string} 
 */
export const getStatusLabel = (rawStatus) => {
  const norm = normalizeStatus(rawStatus);
  return STATUS_CONFIG[norm].label;
};

/**
 * Retrieves the designated CSS class used by badges and color indicators.
 * 
 * @param {string} rawStatus 
 * @returns {string} (e.g. 'status-success')
 */
export const getStatusStyle = (rawStatus) => {
  const norm = normalizeStatus(rawStatus);
  return STATUS_CONFIG[norm].styleClass;
};

/**
 * Evaluates how far along a process is numerically to easily drive progress bars safely.
 * 
 * @param {string} rawStatus 
 * @returns {number} (e.g. 1 == Open/Pending, 2 == Working/Approved, 3+ == Terminal states)
 */
export const getWorkflowStage = (rawStatus) => {
  const norm = normalizeStatus(rawStatus);
  return STATUS_CONFIG[norm].stage;
};

/**
 * Convenience helper to determine if a status is considered "terminal" (e.g. CLOSED, REJECTED)
 * 
 * @param {string} rawStatus 
 * @returns {boolean}
 */
export const isTerminalStatus = (rawStatus) => {
  const norm = normalizeStatus(rawStatus);
  return ['CLOSED', 'REJECTED', 'CANCELLED', 'RESOLVED'].includes(norm);
};

const statusUtils = {
  STATUSES,
  normalizeStatus,
  getStatusLabel,
  getStatusStyle,
  getWorkflowStage,
  isTerminalStatus
};

export default statusUtils;
