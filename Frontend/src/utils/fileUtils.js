/**
 * File Utility Library
 * Centralizes browser-native File API logic to easily validate, size-check, 
 * and generate object URLs for previewing images/PDFs before uploading to the backend.
 */

// Global Baseline Thresholds
const DEFAULT_MAX_SIZE_MB = 5;
const DEFAULT_ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

/**
 * Checks if a selected file exceeds an acceptable megabyte threshold.
 * Prevents massive uploads from crashing the backend node environment.
 * 
 * @param {File} file - Native browser File object
 * @param {number} maxMb - Target maximum MB limit (Default: 5)
 * @returns {boolean}
 */
export const validateFileSize = (file, maxMb = DEFAULT_MAX_SIZE_MB) => {
  if (!file) return false;
  const maxBytes = maxMb * 1024 * 1024;
  return file.size <= maxBytes;
};

/**
 * Ensures the selected file's MIME type exists in an explicitly trusted list.
 * Defends against arbitrary executable executions.
 * 
 * @param {File} file 
 * @param {Array<string>} allowedTypes - Array of allowed mime/types
 * @returns {boolean}
 */
export const validateFileType = (file, allowedTypes = DEFAULT_ALLOWED_TYPES) => {
  if (!file || !file.type) return false;
  return allowedTypes.includes(file.type);
};

/**
 * Checks an array of files against a maximum numerical limit.
 * Useful for limiting a Ticket to only "3 attachments maximum".
 * 
 * @param {Array<File>|FileList} filesArray 
 * @param {number} maxCount 
 * @returns {boolean}
 */
export const validateFileCount = (filesArray, maxCount = 3) => {
  if (!filesArray) return true;
  return filesArray.length <= maxCount;
};

/**
 * Creates an ephemeral, browser-local URL that represents the image/file in memory.
 * Allows the React UI to display an "<img src>" preview instantly without waiting for a server upload.
 * 
 * @param {File} file 
 * @returns {string|null} - Blob URL string
 */
export const createPreviewUrl = (file) => {
  if (!file || typeof window === 'undefined') return null;
  
  // Browsers natively supply URL.createObjectURL to hook a file in memory
  try {
    return URL.createObjectURL(file);
  } catch (error) {
    console.error("Failed to generate preview URL:", error);
    return null;
  }
};

/**
 * Purges the ephemeral blob URL from browser memory to prevent RAM memory leaks.
 * Always fire this strictly when the component unmounts or the preview is dismissed!
 * 
 * @param {string} url - The blob string returned from createPreviewUrl
 */
export const removePreviewUrl = (url) => {
  if (!url || typeof window === 'undefined') return;
  
  try {
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Failed to revoke preview URL:", error);
  }
};

/**
 * Formats a raw byte count into a readable human string.
 * @param {number} bytes 
 * @returns {string} (e.g. "2.4 MB")
 */
export const formatBytes = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const fileUtils = {
  validateFileSize,
  validateFileType,
  validateFileCount,
  createPreviewUrl,
  removePreviewUrl,
  formatBytes
};

export default fileUtils;
