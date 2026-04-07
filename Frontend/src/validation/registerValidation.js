// registerValidation.js
export const validateRegister = (values) => {
  const errors = {};

  if (!values.fullName) {
    errors.fullName = "Full Name is required";
  } else if (values.fullName.trim().length < 3) {
    errors.fullName = "Full Name must be at least 3 characters";
  }

  if (!values.email) {
    errors.email = "Email is required";
  } else if (!/^[A-Z0-9._%+-]+@my\.sliit\.lk$/i.test(values.email)) {
    errors.email = "Email must explicitly end with @my.sliit.lk";
  }

  if (!values.password) {
    errors.password = "Password is required";
  } else if (values.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = "Confirm Password is required";
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
};
