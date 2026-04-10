export const validateEditProfileField = (name, value) => {
  let error = '';

  switch (name) {
    case 'name':
      if (!value || !value.trim()) {
        error = 'Full Name cannot be empty';
      } else if (value.trim().length < 3) {
        error = 'Full Name must have 3 or more characters';
      }
      break;
    
    case 'phone':
      if (!value || !value.trim()) {
        error = 'Phone number cannot be empty';
      } else if (value.trim().length !== 10) {
        error = 'Phone number must have exactly 10 characters';
      } else if (!/^\d{10}$/.test(value.trim())) {
        error = 'Phone number must contain only numbers';
      }
      break;

    case 'department':
      if (!value || !value.trim()) {
        error = 'Department/Faculty cannot be empty';
      } else if (value.trim().length < 3) {
        error = 'Department/Faculty must have 3 or more characters';
      }
      break;
      
    default:
      break;
  }

  return error;
};

export const validateEditProfileForm = (formData) => {
  const errors = {};
  
  const nameError = validateEditProfileField('name', formData.name);
  if (nameError) errors.name = nameError;

  const phoneError = validateEditProfileField('phone', formData.phone);
  if (phoneError) errors.phone = phoneError;

  const deptError = validateEditProfileField('department', formData.department);
  if (deptError) errors.department = deptError;

  return errors;
};
