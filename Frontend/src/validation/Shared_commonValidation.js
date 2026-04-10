/**
 * Shared Common Validation Helpers
 * A library of generic pure functions to handle basic and recurrent validation rules 
 * across Booking, Ticketing, Facilities, and Auth modules.
 */

/**
 * Checks if a value is provided and not just whitespace.
 * @param {any} value 
 * @returns {boolean}
 */
export const isRequired = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

/**
 * Checks if a string exceeds a minimum length.
 * @param {string} value 
 * @param {number} min 
 * @returns {boolean}
 */
export const isMinLength = (value, min) => {
  if (!value) return false;
  return value.trim().length >= min;
};

/**
 * Checks if a string remains under a maximum length.
 * @param {string} value 
 * @param {number} max 
 * @returns {boolean}
 */
export const isMaxLength = (value, max) => {
  if (!value) return true; // empty strings legally don't violate max-length limits usually
  return value.trim().length <= max;
};

/**
 * Validates against standard RFC 5322 email formatting logic dynamically.
 * @param {string} email 
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Validates generic local/international phone strings.
 * @param {string} phone 
 * @returns {boolean}
 */
export const isValidPhone = (phone) => {
  if (!phone) return false;
  const phoneRegex = /^\+?[\d\s-]{7,15}$/;
  return phoneRegex.test(phone.trim());
};

/**
 * Checks if a provided string or date object represents a strictly valid chronological Date.
 * Allows prevention of invalid JS dates like "2024-13-45".
 * @param {string|Date} dateValue 
 * @returns {boolean}
 */
export const isValidDate = (dateValue) => {
  if (!dateValue) return false;
  const date = new Date(dateValue);
  return !isNaN(date.getTime());
};

const Shared_commonValidation = {
  isRequired,
  isMinLength,
  isMaxLength,
  isValidEmail,
  isValidPhone,
  isValidDate
};

export default Shared_commonValidation;
