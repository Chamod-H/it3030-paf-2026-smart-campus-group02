import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './T_BookingDetailsPage.css';
import T_BookingStatusBadge from '../../components/T_booking/T_BookingStatusBadge';

const T_BookingDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mocking the backend fetch for a specific booking
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulated DB
  const mockDB = [
    {
      id: 'BK-1001',
      resourceName: 'Auditorium A',
      resourceType: 'Lecture hall',
      bookingDate: '2026-05-15',
      startTime: '09:00',
      endTime: '11:00',
      purpose: 'Guest Lecture Series',
      expectedAttendees: 150,
      status: 'APPROVED',
      requesterName: 'Jane Doe (Current User)',
      requesterId: 'STU-9921',
      adminNote: 'Please ensure AV equipment is turned off after use.',
      rejectReason: null,
      createdAt: '2026-04-01T10:30:00Z'
    },
    {
      id: 'BK-1002',
      resourceName: 'Advanced IT Lab',
      resourceType: 'Lab',
      bookingDate: '2026-05-18',
      startTime: '14:00',
      endTime: '17:00',
      purpose: 'Networking Workshop',
      expectedAttendees: 30,
      status: 'REJECTED',
      requesterName: 'Jane Doe (Current User)',
      requesterId: 'STU-9921',
      adminNote: null,
      rejectReason: 'The lab is scheduled for deep maintenance during this entire week.',
      createdAt: '2026-04-05T14:15:00Z'
    }
  ];

  useEffect(() => {
    // Simulate API fetch delay
    setTimeout(() => {
      const found = mockDB.find(b => b.id === id);
      if (found) {
        setBooking(found);
      }
      setIsLoading(false);
    }, 600);
  }, [id]);

  const handleCancelBooking = () => {
    if (window.confirm("Are you entirely sure you want to completely cancel this booking?")) {
      // Simulate API cancel request
      setBooking(prev => ({ ...prev, status: 'CANCELLED' }));
    }
  };

  if (isLoading) {
    return <div className="t-bdp-loading">Loading booking details...</div>;
  }

  if (!booking) {
    return (
      <div className="t-bdp-not-found">
        <h2>Booking Not Found</h2>
        <p>The booking record {id} does not exist or you lack permission to view it.</p>
        <button onClick={() => navigate('/bookings/my')} className="t-bdp-btn-back">
          ← Back to My Bookings
        </button>
      </div>
    );
  }

  const isActive = ['PENDING', 'APPROVED'].includes(booking.status);

  return (
    <div className="t-booking-details-page">
      <div className="t-bdp-header">
        <button onClick={() => navigate(-1)} className="t-bdp-btn-back">
          ← Back
        </button>
        <div className="t-bdp-title-row">
          <h1>Booking Details: {booking.id}</h1>
          <T_BookingStatusBadge status={booking.status} />
        </div>
      </div>

      <div className="t-bdp-content">
        {/* Core Booking Information */}
        <section className="t-bdp-section t-bdp-card">
          <h2>Core Information</h2>
          <div className="t-bdp-grid">
            <div className="t-bdp-data-group">
              <label>Facility / Resource</label>
              <div className="t-bdp-value">{booking.resourceName} <span className="t-bdp-sub-text">({booking.resourceType})</span></div>
            </div>
            
            <div className="t-bdp-data-group">
              <label>Requested Date</label>
              <div className="t-bdp-value">{booking.bookingDate}</div>
            </div>

            <div className="t-bdp-data-group">
              <label>Time Duration</label>
              <div className="t-bdp-value">{booking.startTime} - {booking.endTime}</div>
            </div>

            <div className="t-bdp-data-group">
              <label>Expected Attendees</label>
              <div className="t-bdp-value">{booking.expectedAttendees} People</div>
            </div>

            <div className="t-bdp-data-group t-bdp-full-width">
              <label>Purpose of Booking</label>
              <div className="t-bdp-value">{booking.purpose}</div>
            </div>
          </div>
        </section>

        {/* Requester Information */}
        <section className="t-bdp-section t-bdp-card">
          <h2>Requester Profile</h2>
          <div className="t-bdp-grid">
            <div className="t-bdp-data-group">
              <label>Name</label>
              <div className="t-bdp-value">{booking.requesterName}</div>
            </div>
            <div className="t-bdp-data-group">
              <label>User ID</label>
              <div className="t-bdp-value">{booking.requesterId}</div>
            </div>
            <div className="t-bdp-data-group">
              <label>System Created</label>
              <div className="t-bdp-value">{new Date(booking.createdAt).toLocaleString()}</div>
            </div>
          </div>
        </section>

        {/* Administrative Feedback block (Conditionally rendered) */}
        {(booking.adminNote || booking.rejectReason) && (
          <section className={`t-bdp-section t-bdp-card ${booking.rejectReason ? 't-bdp-card-danger' : 't-bdp-card-success'}`}>
            <h2>Administrative Feedback</h2>
            
            {booking.rejectReason && (
              <div className="t-bdp-feedback-block">
                <label className="t-bdp-danger-text">Reason for Rejection:</label>
                <p>{booking.rejectReason}</p>
              </div>
            )}

            {booking.adminNote && (
              <div className="t-bdp-feedback-block">
                <label className="t-bdp-success-text">Approval Notes:</label>
                <p>{booking.adminNote}</p>
              </div>
            )}
          </section>
        )}

        {/* Action Controls */}
        <div className="t-bdp-actions">
          {isActive && (
            <button className="t-bdp-btn-cancel" onClick={handleCancelBooking}>
              Cancel This Booking
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default T_BookingDetailsPage;
