/**
 * Date Utility Library
 * Centralized formatting and parsing logic for rendering chronological data consistently 
 * across the entire Smart Campus UI, parsing ISO SQL/Mongo Date strings automatically.
 */

/**
 * Parses an unknown date format safely.
 * @param {string|Date} dateVal 
 * @returns {Date|null}
 */
const safeParse = (dateVal) => {
  if (!dateVal) return null;
  const d = new Date(dateVal);
  return isNaN(d.getTime()) ? null : d;
};

/**
 * Formats a Date to a clean, readable calendar date.
 * Ex: "March 15, 2026"
 */
export const formatDate = (dateString) => {
  const date = safeParse(dateString);
  if (!date) return 'Invalid Date';
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

/**
 * Formats a Date to include the 12-hour clock time.
 * Ex: "March 15, 2026, 2:30 PM"
 */
export const formatDateTime = (dateString) => {
  const date = safeParse(dateString);
  if (!date) return 'Invalid Date';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(date);
};

/**
 * Checks securely if a date exists historically.
 * Useful for validating if a Booking hasn't already expired.
 */
export const isPastDate = (dateString) => {
  const date = safeParse(dateString);
  if (!date) return false;
  return date.getTime() < new Date().getTime();
};

/**
 * Checks if a date exists in the future.
 * Useful for validating if a Ticket Due Date logic is correct.
 */
export const isFutureDate = (dateString) => {
  const date = safeParse(dateString);
  if (!date) return false;
  return date.getTime() > new Date().getTime();
};

/**
 * Compares two dates to determine chronological order.
 * Returning -1 (a < b), 0 (a == b), or 1 (a > b)
 */
export const compareDates = (dateA, dateB) => {
  const timeA = safeParse(dateA)?.getTime() || 0;
  const timeB = safeParse(dateB)?.getTime() || 0;
  if (timeA < timeB) return -1;
  if (timeA > timeB) return 1;
  return 0;
};

/**
 * Converts a raw backend string into a dynamic relative payload.
 * Extremely useful for Activity Streams or Notifications.
 * Ex: "Just now", "2 hours ago", "in 5 days"
 */
export const formatRelativeTime = (dateString) => {
  const date = safeParse(dateString);
  if (!date) return 'Unknown Time';

  const now = new Date();
  const diffInSeconds = Math.round((date.getTime() - now.getTime()) / 1000);
  const isFuture = diffInSeconds > 0;
  const aDiff = Math.abs(diffInSeconds);

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  if (aDiff < 60) return isFuture ? 'in a few seconds' : 'just now';
  if (aDiff < 3600) return rtf.format((isFuture ? 1 : -1) * Math.floor(aDiff / 60), 'minute');
  if (aDiff < 86400) return rtf.format((isFuture ? 1 : -1) * Math.floor(aDiff / 3600), 'hour');
  if (aDiff < 2592000) return rtf.format((isFuture ? 1 : -1) * Math.floor(aDiff / 86400), 'day');
  if (aDiff < 31536000) return rtf.format((isFuture ? 1 : -1) * Math.floor(aDiff / 2592000), 'month');
  
  return rtf.format((isFuture ? 1 : -1) * Math.floor(aDiff / 31536000), 'year');
};

const dateUtils = {
  formatDate,
  formatDateTime,
  isPastDate,
  isFutureDate,
  compareDates,
  formatRelativeTime
};

export default dateUtils;
