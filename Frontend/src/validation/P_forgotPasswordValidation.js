export const validateEmailReq = (email) => {
  if (!email || !email.trim()) return "Student Email is required.";
  if (!email.toLowerCase().endsWith('@my.sliit.lk')) return "Invalid domain. Please use a valid @my.sliit.lk address.";
  return null;
};

export const validateOtpReq = (otp) => {
  if (!otp || !otp.trim()) return "OTP Code is required.";
  if (otp.trim().length !== 6) return "OTP Code must be exactly 6 digits long.";
  return null;
};

export const validateNewPasswordReq = (password) => {
  if (!password) return "New Password is required.";
  if (password.length < 6) return "Password must be at least 6 characters long.";
  return null;
};
