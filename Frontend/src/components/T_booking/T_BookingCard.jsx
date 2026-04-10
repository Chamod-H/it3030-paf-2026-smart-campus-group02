import React, { useState, useEffect } from 'react';
import './T_BookingCard.css';
import I_resourceService from '../../services/I_resourceService';

/**
 * Displays a single booking in card format.
 * Suitable for both Student and Admin dashboards based on the userRole prop.
 */
const T_BookingCard = ({
  booking,
  userRole = 'student', // 'student' or 'admin'
  onView,
  onCancel,
  onApprove,
  onReject
}) => {
  const [resourceName, setResourceName] = useState(booking?.resourceName || 'Loading...');
  const [resourceType, setResourceType] = useState(booking?.resourceType || '');

  useEffect(() => {
    if (booking && booking.resourceId) {
      I_resourceService.getResourceById(booking.resourceId)
        .then(res => {
          if (!booking.resourceName) {
            setResourceName(res?.name || 'Unknown Resource');
          }
          setResourceType(res?.type || '');
        })
        .catch(() => {
          if (!booking.resourceName) setResourceName('Unknown Resource');
        });
    } else if (booking && booking.resourceName) {
      setResourceName(booking.resourceName);
    }
  }, [booking]);

  if (!booking) return null;

  // Status badge styling map
  const getStatusStyle = (status) => {
    switch(status?.toUpperCase()) {
      case 'PENDING': return 't-badge-pending';
      case 'APPROVED': return 't-badge-approved';
      case 'REJECTED': return 't-badge-rejected';
      case 'CANCELLED': return 't-badge-cancelled';
      case 'COMPLETED': return 't-badge-completed';
      default: return 't-badge-default';
    }
  };

  const isPending = booking.status?.toUpperCase() === 'PENDING';
  const isActive = ['PENDING', 'APPROVED'].includes(booking.status?.toUpperCase());

  return (
    <div className="t-booking-card">
      <div className="t-bc-header">
        <h4 className="t-bc-title">{resourceName}</h4>
        <span className={`t-bc-status ${getStatusStyle(booking.status)}`}>
          {booking.status || 'UNKNOWN'}
        </span>
      </div>

      <div className="t-bc-body">
        <div className="t-bc-row">
          <span className="t-bc-label">📅 Date:</span>
          <span className="t-bc-value">{booking.date}</span>
        </div>
        <div className="t-bc-row">
          <span className="t-bc-label">⏰ Time:</span>
          <span className="t-bc-value">{booking.startTime} - {booking.endTime}</span>
        </div>
        <div className="t-bc-row">
          <span className="t-bc-label">🎯 Purpose:</span>
          <span className="t-bc-value t-bc-truncate" title={booking.purpose}>{booking.purpose}</span>
        </div>
        {resourceType && (
          <div className="t-bc-row">
            <span className="t-bc-label">
              {resourceType === 'Equipment' ? '📦 Quantity:' : '👥 Attendees:'}
            </span>
            <span className="t-bc-value">
              {resourceType === 'Equipment' ? booking.quantity : booking.expectedAttendees}
            </span>
          </div>
        )}
        
        {/* Only show requester name for admins natively */}
        {userRole === 'admin' && booking.requesterName && (
          <div className="t-bc-row t-bc-admin-info">
            <span className="t-bc-label">🧑‍🎓 Requester:</span>
            <span className="t-bc-value">{booking.requesterName}</span>
          </div>
        )}
      </div>

      <div className="t-bc-footer">
        <button 
          className="t-bc-btn t-bc-btn-view" 
          onClick={() => onView && onView(booking)}
        >
           View
        </button>

        {/* Student actions: Can generally only cancel their own active/pending bookings */}
        {userRole === 'student' && isActive && (
          <button 
            className="t-bc-btn t-bc-btn-cancel" 
            onClick={() => onCancel && onCancel(booking)}
          >
            Cancel
          </button>
        )}

        {/* Admin actions: Can approve/reject pending bookings, or aggressively revoke approved ones */}
        {userRole === 'admin' && isPending && (
          <>
            <button 
              className="t-bc-btn t-bc-btn-success" 
              onClick={() => onApprove && onApprove(booking)}
            >
              Approve
            </button>
            <button 
              className="t-bc-btn t-bc-btn-reject" 
              onClick={() => onReject && onReject(booking)}
            >
              Reject
            </button>
          </>
        )}
        
        {userRole === 'admin' && booking.status?.toUpperCase() === 'APPROVED' && (
          <button 
            className="t-bc-btn t-bc-btn-cancel" 
            onClick={() => onCancel && onCancel(booking)}
          >
            Revoke
          </button>
        )}
      </div>
    </div>
  );
};

export default T_BookingCard;
