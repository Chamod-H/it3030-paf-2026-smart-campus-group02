/**
 * Validation utilities for User Profiles and Registration.
 */

export const validatePhoneNumber = (phone) => {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone.trim());
};

export const validateProfileImage = (file) => {
  if (!file) return null;
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return 'Invalid file type. Only JPG, PNG, and WebP are supported.';
  }
  const maxSize = 2 * 1024 * 1024; // 2MB
  if (file.size > maxSize) {
    return 'File size too large. Maximum limit is 2MB.';
  }
  return null;
};

/**
 * Validates the strict SLIIT Student Registration Profile Form.
 */
export const validateProfileForm = (formData) => {
  const errors = {};

  // Username
  if (!formData.name || !formData.name.trim()) {
    errors.name = 'Username is required';
  } else if (formData.name.trim().length < 3) {
    errors.name = 'Username must be at least 3 characters';
  }

  // Student Email Enforcement
  if (!formData.email || !formData.email.trim()) {
    errors.email = 'Email is required';
  } else if (!formData.email.trim().toLowerCase().endsWith('@my.sliit.lk')) {
    errors.email = 'Must be a valid student address ending in @my.sliit.lk';
  }

  // Mobile
  if (!formData.phone || !formData.phone.trim()) {
    errors.phone = 'Mobile number is required';
  } else if (!validatePhoneNumber(formData.phone)) {
    errors.phone = 'Mobile must be exactly 10 digits';
  }

  // Password
  if (!formData.password) {
    errors.password = 'Password is required';
  } else if (formData.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  // Department
  if (!formData.department || !formData.department.trim()) {
    errors.department = 'Please select your department';
  }

  return errors;
};

export const validateAdminUserForm = (formData, isEdit) => {
  const errors = {};

  if (!formData.username || !formData.username.trim()) {
    errors.username = 'Full Name is required';
  } else if (formData.username.trim().length < 3) {
    errors.username = 'Name must be at least 3 characters';
  }

  if (!formData.email || !formData.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
    errors.email = 'Must be a valid email format';
  } else if (formData.role === 'STUDENT' && !formData.email.trim().toLowerCase().endsWith('@my.sliit.lk')) {
    errors.email = 'Student emails must end with @my.sliit.lk';
  } else if (formData.role !== 'STUDENT' && !formData.email.trim().toLowerCase().endsWith('@sliit.lk') && !formData.email.trim().toLowerCase().endsWith('@my.sliit.lk')) {
    errors.email = 'Staff/Lecturer emails must end with @sliit.lk or @my.sliit.lk';
  }

  if (formData.phone && !validatePhoneNumber(formData.phone)) {
    errors.phone = 'Mobile must be exactly 10 digits';
  }

  if (!isEdit && (!formData.password || formData.password.length < 6)) {
    errors.password = 'Password must be at least 6 characters';
  } else if (isEdit && formData.password && formData.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (!formData.department || !formData.department.trim()) {
    errors.department = 'Department is required';
  }

  return errors;
};

const P_profileValidation = {
  validateProfileForm,
  validateAdminUserForm,
  validatePhoneNumber,
  validateProfileImage
};

export default P_profileValidation;
