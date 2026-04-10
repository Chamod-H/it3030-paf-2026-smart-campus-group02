/**
 * Validates the capacity field explicitly.
 * @param {any} value - Capacity value to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateCapacity = (value) => {
  if (value === undefined || value === null || value === '') {
    return "Capacity is required";
  }
  const num = Number(value);
  if (isNaN(num)) {
    return "Capacity must be a number";
  }
  if (num <= 0) {
    return "Capacity must be a positive number greater than 0";
  }
  if (!Number.isInteger(num)) {
    return "Capacity must be a whole number";
  }
  return null;
};

/**
 * Validates an availability window definition string or object.
 * @param {any} data - Availability window array or string
 * @returns {string|null} Error message or null if valid
 */
export const validateAvailabilityWindow = (data) => {
  if (typeof data === 'string') {
    if (!data.trim()) {
      return "Availability window/summary is required";
    }
    if (data.trim().length < 5) {
      return "Availability summary string is too short";
    }
    return null;
  }
  
  if (Array.isArray(data)) {
    if (data.length === 0) {
      return "At least one availability window must be specified";
    }
    return null;
  }

  return "Invalid availability format";
};

/**
 * Validates the entire resource creation/edit form.
 * @param {Object} formData - The complete resource form object
 * @returns {Object} An object containing field-specific error strings. Empty if valid.
 */
export const validateResourceForm = (formData) => {
  const errors = {};

  // Resource Name Rule
  if (!formData.name || !formData.name.trim()) {
    errors.name = "Resource name is required";
  } else if (formData.name.trim().length < 3) {
    errors.name = "Resource name must be at least 3 characters long";
  }

  // Type Rule
  const validTypes = ["Lecture hall", "Lab", "Meeting room", "Equipment"];
  if (!formData.type) {
    errors.type = "Resource type is required";
  } else if (!validTypes.includes(formData.type)) {
    errors.type = "Selected resource type is invalid";
  }

  // Capacity / Quantity Rule
  if (formData.type === 'Equipment') {
    if (formData.quantity === undefined || formData.quantity === null || formData.quantity === '') {
      errors.quantity = "Quantity is required";
    } else {
      const num = Number(formData.quantity);
      if (isNaN(num)) errors.quantity = "Quantity must be a number";
      else if (num <= 0) errors.quantity = "Quantity must be a positive number greater than 0";
      else if (!Number.isInteger(num)) errors.quantity = "Quantity must be a whole number";
    }
  } else {
    const capacityError = validateCapacity(formData.capacity);
    if (capacityError) {
      errors.capacity = capacityError;
    }
  }

  // Location Rule
  if (!formData.location || !formData.location.trim()) {
    errors.location = "Location is required";
  }

  // Description Rule
  if (!formData.description || !formData.description.trim()) {
    errors.description = "Description is required";
  } else if (formData.description.trim().length < 10) {
    errors.description = "Description must be at least 10 characters to provide sufficient detail";
  }

  // Availability Windows Rule
  if (formData.availabilitySummary !== undefined) {
    const avError = validateAvailabilityWindow(formData.availabilitySummary);
    if (avError) {
      errors.availabilitySummary = avError;
    }
  }

  // Status Rule
  const validStatuses = ["ACTIVE", "OUT_OF_SERVICE"];
  if (!formData.status) {
    errors.status = "Status is required";
  } else if (!validStatuses.includes(formData.status)) {
    errors.status = "Invalid status selected";
  }

  // Optional Image File Type Check
  if (formData.imageFile) {
    const validImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validImageTypes.includes(formData.imageFile.type)) {
      errors.imageFile = "Image must be a JPEG, PNG, or WebP file";
    } else if (formData.imageFile.size > 5 * 1024 * 1024) {
      errors.imageFile = "Image size cannot exceed 5MB";
    }
  }

  return errors;
};

const I_resourceValidation = {
  validateResourceForm,
  validateCapacity,
  validateAvailabilityWindow
};

export default I_resourceValidation;
