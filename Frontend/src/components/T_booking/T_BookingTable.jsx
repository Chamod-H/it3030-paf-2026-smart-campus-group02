import React, { useState, useEffect } from 'react';
import './T_BookingTable.css';
import I_resourceService from '../../services/I_resourceService';

/**
 * Structured table for Admins to review and manage multiple bookings.
 * 
 * @param {Array} bookings - List of booking objects
 * @param {Function} onView - Handler for viewing details
 * @param {Function} onApprove - Handler for approving a pending booking
 * @param {Function} onReject - Handler for rejecting a pending booking
 * @param {Function} onCancel - Handler for revoking an approved booking
 */
const T_BookingTable = ({
  bookings = [],
  onView,
  onApprove,
  onReject,
  onCancel
}) => {

  const [resourceNames, setResourceNames] = useState({});

  useEffect(() => {
    const fetchMissingResources = async () => {
      if (!bookings || bookings.length === 0) return;
      
      const missingIds = [...new Set(bookings
        .filter(b => !b.resourceName && b.resourceId)
        .map(b => b.resourceId)
      )];

      if (missingIds.length === 0) return;

      const results = { ...resourceNames };
      let newFetched = false;

      for (const id of missingIds) {
        if (!results[id]) {
          try {
            const res = await I_resourceService.getResourceById(id);
            if (res && res.name) {
              results[id] = res.name;
              newFetched = true;
            }
          } catch (e) {
            console.error("Failed to map resource id", id, e);
          }
        }
      }

      if (newFetched) {
        setResourceNames(results);
      }
    };

    fetchMissingResources();
  }, [bookings]); // eslint-disable-next-line react-hooks/exhaustive-deps

  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING': return 't-bt-badge-pending';
      case 'APPROVED': return 't-bt-badge-approved';
      case 'REJECTED': return 't-bt-badge-rejected';
      case 'CANCELLED': return 't-bt-badge-cancelled';
      case 'COMPLETED': return 't-bt-badge-completed';
      default: return 't-bt-badge-default';
    }
  };

  if (!bookings || bookings.length === 0) {
    return (
      <div className="t-booking-table-empty">
        <div className="t-bt-empty-icon">📂</div>
        <p>No bookings found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="t-booking-table-container">
      <table className="t-booking-table">
        <thead>
          <tr>
            <th>Resource Target</th>
            <th>User Name</th>
            <th>Purpose</th>
            <th>Attendees</th>
            <th>Notes</th>
            <th>Date</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Status</th>
            <th className="t-bt-actions-header">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => {
            const isPending = booking.status?.toUpperCase() === 'PENDING';
            const isApproved = booking.status?.toUpperCase() === 'APPROVED';

            return (
              <tr key={booking.id}>
                <td className="t-bt-primary">{booking.resourceName || resourceNames[booking.resourceId] || booking.resourceId}</td>
                <td>{booking.requesterName || booking.userId}</td>
                <td>{booking.purpose}</td>
                <td>{booking.expectedAttendees}</td>
                <td>{booking.notes || '-'}</td>
                <td>{booking.date}</td>
                <td>{booking.startTime}</td>
                <td>{booking.endTime}</td>
                <td>
                  <span className={`t-bt-badge ${getStatusBadge(booking.status)}`}>
                    {booking.status || 'UNKNOWN'}
                  </span>
                </td>
                <td className="t-bt-actions">
                  {booking.status?.toUpperCase() !== 'APPROVED' && (
                    <button 
                      className="t-bt-btn t-bt-btn-approve"
                      onClick={() => onApprove && onApprove(booking)}
                      title="Approve Booking"
                    >
                      ✅ Approve
                    </button>
                  )}
                  
                  {booking.status?.toUpperCase() !== 'REJECTED' && (
                    <button 
                      className="t-bt-btn t-bt-btn-reject"
                      onClick={() => onReject && onReject(booking)}
                      title="Reject Booking"
                    >
                      ❌ Reject
                    </button>
                  )}

                  {booking.status?.toUpperCase() !== 'PENDING' && (
                    <button 
                      className="t-bt-btn t-bt-btn-cancel"
                      onClick={() => onCancel && onCancel(booking)}
                      title="Set to Pending"
                    >
                      ⏳ Pending
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default T_BookingTable;
