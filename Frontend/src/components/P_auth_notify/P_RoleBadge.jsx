import React from 'react';
import PropTypes from 'prop-types';
import './P_RoleBadge.css';

const ROLE_CONFIG = {
  admin:        { label: 'Admin',        cls: 'p-rb-admin',      icon: '🛡️' },
  lecturer:     { label: 'Lecturer',     cls: 'p-rb-manager',    icon: '👨‍🏫' },
  student:      { label: 'Student',      cls: 'p-rb-user',       icon: '🎓' },
  staff_member: { label: 'Staff Member', cls: 'p-rb-technician', icon: '🔧' },
};

/**
 * Small pill badge that displays the current user's role.
 * @param {string}  role     - Role string (case-insensitive).
 * @param {boolean} showIcon - Whether to display the role icon (default true).
 * @param {'sm'|'md'|'lg'} size - Badge size (default 'md').
 */
const P_RoleBadge = ({ role, showIcon = true, size = 'md' }) => {
  const normalizedRole = (role || '').toLowerCase();
  
  // Map various strings to base roles safely handling UI misspellings
  let roleKey = 'unknown';
  if (['admin', 'administrator', 'superadmin'].includes(normalizedRole)) roleKey = 'admin';
  else if (['lecturer', 'teacher', 'prof'].includes(normalizedRole)) roleKey = 'lecturer';
  else if (['staff_member', 'staff', 'technician'].includes(normalizedRole)) roleKey = 'staff_member';
  else if (['student', 'user', 'client', 'member'].includes(normalizedRole)) roleKey = 'student';

  const cfg = ROLE_CONFIG[roleKey] || { label: role || 'Unknown', cls: 'p-rb-unknown', icon: '❓' };

  return (
    <span className={`p-role-badge ${cfg.cls} p-rb-${size}`} title={`Role: ${cfg.label}`}>
      {showIcon && <span className="p-rb-icon" aria-hidden="true">{cfg.icon}</span>}
      <span className="p-rb-label">{cfg.label}</span>
    </span>
  );
};

P_RoleBadge.propTypes = {
  role: PropTypes.string,
  showIcon: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
};

export default P_RoleBadge;
