import React from 'react';
import './C_TicketPriorityBadge.css';

/**
 * Universal minimal UI badge structurally mapping system Maintenance Ticket physical priority bounds.
 */
const C_TicketPriorityBadge = ({ priority }) => {
  if (!priority) return null;

  // Derive explicit contextual formatting directly from priority mappings
  let badgeClass = 'c-tpb-default';
  let displayLabel = priority.toUpperCase();

  // Safely mapping fallback legacy 'CRITICAL' mapping cleanly into 'URGENT' visually
  switch (displayLabel) {
    case 'LOW':
      badgeClass = 'c-tpb-low';
      break;
    case 'MEDIUM':
      badgeClass = 'c-tpb-medium';
      break;
    case 'HIGH':
      badgeClass = 'c-tpb-high';
      break;
    case 'CRITICAL':
    case 'URGENT':
      badgeClass = 'c-tpb-urgent';
      displayLabel = 'URGENT';
      break;
    default:
      badgeClass = 'c-tpb-default';
      break;
  }

  return (
    <span className={`c-ticket-priority-badge ${badgeClass}`}>
      {displayLabel}
    </span>
  );
};

export default C_TicketPriorityBadge;
