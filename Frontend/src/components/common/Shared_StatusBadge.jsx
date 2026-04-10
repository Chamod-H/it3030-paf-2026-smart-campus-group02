import React from 'react';
import './Shared_StatusBadge.css';

/**
 * Generic Status Badge Component
 * Standardized across modules to ensure visual consistency for all states
 * (resources, bookings, tickets, and user accounts).
 * 
 * @param {string} status - Exact text to display inside the badge
 * @param {string} type - Semantic type override ('success', 'warning', 'danger', 'info', 'default')
 */
const Shared_StatusBadge = ({ status, type }) => {
  if (!status) return null;

  const normalizedStatus = status.toString().toLowerCase().trim();
  let badgeClass = type;

  // Auto-mapping logic if a specific semantic type is not provided
  if (!badgeClass) {
    if (['active', 'approved', 'resolved', 'available', 'success'].includes(normalizedStatus)) {
      badgeClass = 'success';
    } else if (['pending', 'in progress', 'maintenance', 'warning'].includes(normalizedStatus)) {
      badgeClass = 'warning';
    } else if (['rejected', 'suspended', 'closed', 'unavailable', 'danger', 'error'].includes(normalizedStatus)) {
      badgeClass = 'danger';
    } else if (['new', 'open', 'info', 'submitted'].includes(normalizedStatus)) {
      badgeClass = 'info';
    } else {
      badgeClass = 'default';
    }
  }

  return (
    <span className={`shared-status-badge badge-${badgeClass.toLowerCase()}`}>
      {status}
    </span>
  );
};

export default Shared_StatusBadge;
