/**
 * Role Utility Library
 * Provides standardized constants and pure functions to evaluate User RBAC
 * based strictly on the required ADMIN, LECTURER, STUDENT, STAFF_MEMBER definitions.
 */

export const ROLES = {
  ADMIN: 'ADMIN',
  LECTURER: 'LECTURER',
  STUDENT: 'STUDENT',
  STAFF_MEMBER: 'STAFF_MEMBER'
};

const normalize = (roleStr) => (roleStr ? String(roleStr).toUpperCase().replace(/ /g, '_') : '');

export const isAdmin = (role) => normalize(role) === ROLES.ADMIN;
export const isLecturer = (role) => normalize(role) === ROLES.LECTURER;
export const isStudent = (role) => normalize(role) === ROLES.STUDENT;
export const isStaffMember = (role) => {
  const r = normalize(role);
  return r === ROLES.STAFF_MEMBER || r === 'STAFF';
};

export const hasAllowedRole = (userRole, allowedRoles = []) => {
  if (!userRole || !allowedRoles || allowedRoles.length === 0) return false;
  const normalizedUserRole = normalize(userRole);
  const normalizedAllowed = allowedRoles.map(normalize);
  return normalizedAllowed.includes(normalizedUserRole);
};

export const getRoleLabel = (role) => {
  const r = normalize(role);
  if (r === ROLES.ADMIN) return 'System Administrator';
  if (r === ROLES.LECTURER) return 'Lecturer';
  if (r === ROLES.STUDENT) return 'Student';
  if (r === ROLES.STAFF_MEMBER || r === 'STAFF') return 'Staff Member';
  return 'Guest / Unknown';
};

const roleUtils = {
  ROLES,
  isAdmin,
  isLecturer,
  isStudent,
  isStaffMember,
  hasAllowedRole,
  getRoleLabel
};

export default roleUtils;
