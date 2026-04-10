import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './T_AdminBookingsPage.css';

import T_BookingFilters from '../../components/T_booking/T_BookingFilters';
import T_BookingTable from '../../components/T_booking/T_BookingTable';
import T_BookingApprovalModal from '../../components/T_booking/T_BookingApprovalModal';
import T_BookingRejectModal from '../../components/T_booking/T_BookingRejectModal';
import T_bookingService from '../../services/T_bookingService';

const T_AdminBookingsPage = () => {
  const navigate = useNavigate();

  // Primary filters matching the required system parameters natively
  const [filters, setFilters] = useState({
    status: '',
    date: '',
    resourceType: '',
    userId: ''
  });

  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await T_bookingService.getAllBookings();
      setAllBookings(data);
    } catch (err) {
      console.error("Failed to fetch all global bookings:", err);
      setError("Failed to retrieve booking moderation queues.");
    } finally {
      setLoading(false);
    }
  };

  // Protective UI Modal State Management
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  // Filtering System Handler 
  const handleApplyFilters = () => {
    console.log("Admin triggering heavy server route filter refresh:", filters);
  };

  const handleResetFilters = () => {
    setFilters({ status: '', date: '', resourceType: '', userId: '' });
  };

  // Base State Filter Engine Simulator
  const filteredBookings = allBookings.filter(b => {
    if (filters.status && b.status !== filters.status) return false;
    if (filters.date && b.bookingDate !== filters.date) return false;
    if (filters.resourceType && b.resourceType !== filters.resourceType) return false;
    if (filters.userId && !b.requesterName.toLowerCase().includes(filters.userId.toLowerCase()) && !b.requesterId.toLowerCase().includes(filters.userId.toLowerCase())) return false;
    return true;
  });

  // Structural Action Logic Hooking to Reusable Components
  const handleView = (booking) => navigate(`/bookings/${booking.id}`);

  const handleOpenApprove = (booking) => {
    setSelectedBooking(booking);
    setApprovalModalOpen(true);
  };

  const handleConfirmApprove = async ({ bookingId, adminNote }) => {
    try {
      await T_bookingService.approveBooking(bookingId, { note: adminNote });
      setAllBookings(prev => prev.map(b => 
        b.id === bookingId ? { ...b, status: 'APPROVED', note: adminNote } : b
      ));
      setApprovalModalOpen(false);
    } catch (err) {
      alert("Failed to physically approve booking logic bounds.");
    }
  };

  const handleOpenReject = (booking) => {
    setSelectedBooking(booking);
    setRejectModalOpen(true);
  };

  const handleConfirmReject = async (bookingId) => {
    try {
      await T_bookingService.rejectBooking(bookingId, { reason: rejectReason });
      setAllBookings(prev => prev.map(b => 
        b.id === bookingId ? { ...b, status: 'REJECTED', reason: rejectReason } : b
      ));
      setRejectModalOpen(false);
    } catch (err) {
      alert("System failed to process aggressive administrative override.");
    }
  };

  const handleSetPending = async (booking) => {
    if (window.confirm(`Are you sure you want to forcibly reset booking ${booking.id} back to PENDING status?`)) {
      try {
        await T_bookingService.setPendingBooking(booking.id);
        setAllBookings(prev => prev.map(b => 
          b.id === booking.id ? { ...b, status: 'PENDING' } : b
        ));
      } catch (err) {
        alert("Failed to physically execute pending reset.");
      }
    }
  };

  // Derived dashboard quick-statistics
  const pendingCount = allBookings.filter(b => b.status === 'PENDING').length;
  const approvedCount = allBookings.filter(b => b.status === 'APPROVED').length;

  return (
    <div className="t-admin-bookings-page">
      <div className="t-abp-header">
        <div className="t-abp-title-area">
          <h1>Booking Moderation Hub</h1>
          <p>Review and authorize all campus utilization requests globally.</p>
        </div>
        
        <div className="t-abp-quick-stats">
          <div className="t-abp-stat t-abp-stat-pending">
            <span className="t-abp-stat-val">{pendingCount}</span>
            <span className="t-abp-stat-lbl">Action Required</span>
          </div>
          <div className="t-abp-stat t-abp-stat-approved">
            <span className="t-abp-stat-val">{approvedCount}</span>
            <span className="t-abp-stat-lbl">Active Approved</span>
          </div>
        </div>
      </div>

      {/* Horizontal filter mode logically enforced via strict layout styling overlay */}
      <div className="t-abp-filter-layer">
        <div className="t-horizontal-mode">
            <T_BookingFilters 
              filters={filters}
              setFilters={setFilters}
              onApply={handleApplyFilters}
              onReset={handleResetFilters}
            />
        </div>
      </div>

      <div className="t-abp-main-content">
        <div className="t-abp-table-wrapper">
          <div className="t-abp-table-meta">
            <span>Aggregating {filteredBookings.length} System Request(s)</span>
          </div>
          
          {loading ? (
            <div className="t-abp-table-meta">
              <span>Establishing secure line to administrative registry...</span>
            </div>
          ) : error ? (
            <div className="t-abp-table-meta">
              <span>{error}</span>
            </div>
          ) : (
            <T_BookingTable 
              bookings={filteredBookings}
              onView={handleView}
              onApprove={handleOpenApprove}
              onReject={handleOpenReject}
              onCancel={handleSetPending}
            />
          )}
        </div>
      </div>

      {/* Secure Modal Handlers */}
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

export default T_AdminBookingsPage;
