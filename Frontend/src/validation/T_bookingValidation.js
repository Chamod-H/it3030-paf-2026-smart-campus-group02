/**
 * Validates if the dynamically provided time range is logically valid (start < end).
 * Natively assumes explicit 24h format strings: "HH:MM"
 * 
 * @param {string} startTime - e.g., "09:00"
 * @param {string} endTime - e.g., "11:00"
 * @returns {string|null} - Physical Error message or null if boundaries are inherently valid
 */
export const validateTimeRange = (startTime, endTime) => {
  if (!startTime) return "Core start time is inherently required.";
  if (!endTime) return "Core end time is inherently required.";

  const [startH, startM] = startTime.split(':').map(Number);
  const [endH, endM] = endTime.split(':').map(Number);

  const startTotalMins = (startH * 60) + startM;
  const endTotalMins = (endH * 60) + endM;

  if (startTotalMins >= endTotalMins) {
    return "End time mathematically strictly must be situated physically after the exact start parameter.";
  }

  return null;
};

/**
 * Validates the expected attendee parameter dynamically against absolute physical resource capacity limits.
 * 
 * @param {number|string} attendees - String or strict digit count
 * @param {number|null} capacity - Passing null functionally bypasses the upper architectural limit check
 * @returns {string|null} - System Error message string or mathematically null
 */
export const validateAttendees = (attendees, capacity) => {
  if (!attendees) return "Target expected attendees parameter is structurally required.";
  
  const attendeeCount = parseInt(attendees, 10);
  
  if (isNaN(attendeeCount) || attendeeCount <= 0) {
    return "Expected attendees count explicitly must map positively above 0.";
  }

  // Strict physical domain boundary condition
  if (capacity !== null && capacity !== undefined && attendeeCount > capacity) {
    return `Physical expected attendees critically exceeds native resource capacity absolute threshold (${capacity}).`;
  }

  return null;
};

/**
 * Secure boundary requirement mapping specifically invoked for Administration rejection constraints globally.
 * 
 * @param {string} reason - Bound text block
 * @returns {string|null}
 */
export const validateRejectReason = (reason) => {
  if (!reason || reason.trim().length === 0) {
    return "A deliberate formalized Rejection Reason constraint is inherently required by global system policy.";
  }
  if (reason.trim().length < 10) {
    return "Please explicitly construct more deeply detailed internal context (minimum 10 characters limit).";
  }
  return null;
};

/**
 * Comprehensive master architectural validator wrapping the entire central Booking Form object.
 * Securely computes all cascading structural errors deeply into a final boundary response map object.
 * 
 * @param {Object} formData - Bound React State parameter maps
 * @param {number|null} resourceCapacity - Known mapped physical tolerance 
 * @param {boolean} hasConflict - Overarching Flag actively computed independently by the asynchronous conflict simulator interceptor
 * @returns {Object} Object encapsulating error mappings deeply: { errors: Object, isValid: boolean }
 */
export const validateBookingForm = (formData, resourceCapacity = null, hasConflict = false) => {
  const errors = {};

  // Level 1: Static Parameter Bound checks natively
  if (!formData.resourceId) errors.resourceId = "Please globally select a target resource block.";
  if (!formData.bookingDate) errors.bookingDate = "A precise specific Booking target date is inherently explicitly required.";
  if (!formData.purpose || !formData.purpose.trim()) errors.purpose = "The structured overarching utilization Purpose is rigorously required.";

  // Level 2: Advanced Time Range Engine Bound Verification Hook
  const timeError = validateTimeRange(formData.startTime, formData.endTime);
  if (timeError) {
    if (!formData.startTime) errors.startTime = "Start parameter time bound is required.";
    if (!formData.endTime) errors.endTime = "End parameter time bound is required.";
    if (formData.startTime && formData.endTime) errors.timeRange = timeError;
  }

  // Level 3: Physics vs Logic Architecture bounds mapping
  const attendeeError = validateAttendees(formData.expectedAttendees, resourceCapacity);
  if (attendeeError) {
    errors.expectedAttendees = attendeeError;
  }

  // Level 4: External Master System Architecture DB collision mapping
  if (hasConflict) {
    errors.conflict = "Global Booking constraint triggered: System actively cannot submit structurally while physically colliding violently with active internal DB active bounds mapping natively.";
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};
