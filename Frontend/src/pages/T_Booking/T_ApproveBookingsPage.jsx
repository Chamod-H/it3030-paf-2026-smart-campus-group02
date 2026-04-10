import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './T_ApproveBookingsPage.css';

import T_BookingCard from '../../components/T_booking/T_BookingCard';
import T_BookingApprovalModal from '../../components/T_booking/T_BookingApprovalModal';
import T_BookingRejectModal from '../../components/T_booking/T_BookingRejectModal';

const T_ApproveBookingsPage = () => {
  const navigate = useNavigate();

  // Mock data specifically filtered by backend to only deliver PENDING items
  const [pendingBookings, setPendingBookings] = useState([
    {
      id: 'BK-1002',
      resourceName: 'Advanced IT Lab',
      bookingDate: '2026-05-18',
      startTime: '14:00',
      endTime: '17:00',
      purpose: 'Networking Workshop',
      expectedAttendees: 30,
      status: 'PENDING',
      requesterName: 'John Smith',
      requesterId: 'STU-8822',
      policyWarning: null
    },
    {
      id: 'BK-1003',
      resourceName: 'Meeting Room Alpha',
      bookingDate: '2026-05-10',
      startTime: '10:00',
      endTime: '11:00',
      purpose: 'Project Sync',
      expectedAttendees: 5,
      status: 'PENDING',
      requesterName: 'Alex Lee',
      requesterId: 'STU-7733',
      policyWarning: 'Potential Conflict: Back-to-back with another booking.'
    },
    {
      id: 'BK-1005',
      resourceName: 'Auditorium B',
      bookingDate: '2026-06-05',
      startTime: '08:00',
      endTime: '18:00',
      purpose: 'Full Day Orientation',
      expectedAttendees: 200,
      status: 'PENDING',
      requesterName: 'Dean of Students',
      requesterId: 'STF-5544',
      policyWarning: 'Capacity Warning: Expected attendees closely matches maximum room threshold.'
    }
  ]);

  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const handleOpenApprove = (booking) => {
    setSelectedBooking(booking);
    setApprovalModalOpen(true);
  };

  const handleConfirmApprove = async ({ bookingId, adminNote }) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Physical deletion from local pending array to simulate resolving the queue item
        setPendingBookings(prev => prev.filter(b => b.id !== bookingId));
        setApprovalModalOpen(false);
        resolve();
      }, 600);
    });
  };

  const handleOpenReject = (booking) => {
    setSelectedBooking(booking);
    setRejectModalOpen(true);
  };

  const handleConfirmReject = async (bookingId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Physical deletion from queue because a reject perfectly handles the action
        setPendingBookings(prev => prev.filter(b => b.id !== bookingId));
        setRejectModalOpen(false);
        resolve();
      }, 600);
    });
  };

  return (
    <div className="t-approve-bookings-page">
      <div className="t-apb-header">
        <div className="t-apb-title-area">
          <h1>Action Queue: Pending Approvals</h1>
          <p>Carefully review and resolve outstanding facility requests. This queue is actively sorted by urgency.</p>
        </div>
        <div className="t-apb-badge">
          {pendingBookings.length} {pendingBookings.length === 1 ? 'Request' : 'Requests'} Left
        </div>
      </div>

      {pendingBookings.length === 0 ? (
        <div className="t-apb-empty">
          <div className="t-apb-empty-icon">🎉</div>
          <h2>All Caught Up!</h2>
          <p>There are physically no pending booking requests requiring your immediate attention.</p>
          <button onClick={() => navigate('/bookings/admin')} className="t-apb-btn-return">
            Return to Admin Dashboard
          </button>
        </div>
      ) : (
        <div className="t-apb-grid">
          {pendingBookings.map(booking => (
            <div key={booking.id} className="t-apb-card-wrapper">
              
              {/* Injecting System Warnings directly above the targeted structural card */}
              {booking.policyWarning && (
                <div className="t-apb-warning-banner">
                  ⚠️ <strong>System Alert:</strong> {booking.policyWarning}
                </div>
              )}
              
              <T_BookingCard
                booking={booking}
                userRole="admin"
                onView={() => navigate(`/bookings/${booking.id}`)}
                onApprove={handleOpenApprove}
                onReject={handleOpenReject}
              />
            </div>
          ))}
        </div>
      )}

      {/* Logic Layers connecting cleanly */}
      <T_BookingApprovalModal 
        isOpen={approvalModalOpen}
        booking={selectedBooking}
        onClose={() => setApprovalModalOpen(false)}
        onConfirm={handleConfirmApprove}
      />

      <T_BookingRejectModal 
        isOpen={rejectModalOpen}
        booking={selectedBooking}
        rejectReason={rejectReason}
        setRejectReason={setRejectReason}
        onClose={() => setRejectModalOpen(false)}
        onConfirmReject={handleConfirmReject}
      />
    </div>
  );
};

export default T_ApproveBookingsPage;
