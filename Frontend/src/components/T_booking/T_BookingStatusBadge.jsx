import React from 'react';
import './T_BookingStatusBadge.css';

/**
 * A highly reusable visual badge representing the exact state of a booking.
 * @param {string} status - PENDING, APPROVED, REJECTED, CANCELLED, COMPLETED
 */
const T_BookingStatusBadge = ({ status }) => {
  if (!status) return null;

  const normalizedStatus = status.toUpperCase();

  const getBadgeStyle = () => {
    switch (normalizedStatus) {
      case 'PENDING':
        return 't-badge-pkg-pending';
      case 'APPROVED':
        return 't-badge-pkg-approved';
      case 'REJECTED':
        return 't-badge-pkg-rejected';
      case 'CANCELLED':
        return 't-badge-pkg-cancelled';
      case 'COMPLETED':
        return 't-badge-pkg-completed';
      default:
        return 't-badge-pkg-default';
    }
  };

  return (
    <span className={`t-booking-status-badge ${getBadgeStyle()}`}>
      {normalizedStatus}
    </span>
  );
};

export default T_BookingStatusBadge;
