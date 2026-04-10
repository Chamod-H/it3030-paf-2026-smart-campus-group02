import React from 'react';
import './C_TicketStatusBadge.css';

/**
 * Universal minimal UI badge structurally mapping system Maintenance Ticket statuses internally gracefully.
 */
const C_TicketStatusBadge = ({ status }) => {
  if (!status) return null;

  // Derive explicit contextual formatting directly from system status map
  let badgeClass = 'c-tsb-default';
  let displayLabel = status.replace('_', ' ');

  switch (status.toUpperCase()) {
    case 'OPEN':
      badgeClass = 'c-tsb-open';
      displayLabel = 'Open (New)';
      break;
    case 'IN_PROGRESS':
      badgeClass = 'c-tsb-progress';
      break;
    case 'RESOLVED':
      badgeClass = 'c-tsb-resolved';
      break;
    case 'CLOSED':
      badgeClass = 'c-tsb-closed';
      break;
    case 'REJECTED':
      badgeClass = 'c-tsb-rejected';
      break;
    default:
      badgeClass = 'c-tsb-default';
      break;
  }

  return (
    <span className={`c-ticket-status-badge ${badgeClass}`}>
      {displayLabel}
    </span>
  );
};

export default C_TicketStatusBadge;
