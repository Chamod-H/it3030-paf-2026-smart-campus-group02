import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './T_MyBookingsPage.css';
import T_BookingFilters from '../../components/T_booking/T_BookingFilters';
import T_BookingCard from '../../components/T_booking/T_BookingCard';
import T_BookingTable from '../../components/T_booking/T_BookingTable';
import T_bookingService from '../../services/T_bookingService';
import { useAuth } from '../../contexts/P_AuthContext';

const T_MyBookingsPage = () => {
  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState('card'); // System toggle state for 'card' or 'table'
  const [filters, setFilters] = useState({
    status: '',
    date: '',
    resourceType: '',
    userId: ''
  });

  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth(); // Needed to determine role for components

  React.useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await T_bookingService.getMyBookings();
      setMyBookings(data);
    } catch (err) {
      console.error("Failed to load user bookings:", err);
      setError("Failed to load your bookings. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = () => {
    // Current native filter operates entirely on frontend cache, no network call required
    console.log("Filters applied:", filters);
  };

  const handleResetFilters = () => {
    setFilters({ status: '', date: '', resourceType: '', userId: '' });
  };

  const handleCancelBooking = async (bookingToCancel) => {
    if (window.confirm(`Are you physically sure you want to cancel booking ${bookingToCancel.id}?`)) {
      try {
        await T_bookingService.cancelBooking(bookingToCancel.id);
        // Optimistically update the UI to avoid another network fetch
        setMyBookings(prev => 
          prev.map(b => b.id === bookingToCancel.id ? { ...b, status: 'CANCELLED' } : b)
        );
      } catch (err) {
        alert("Failed to cancel the booking. It may already be processed.");
      }
    }
  };

  // Local physical filtering simulation mapped to React state
  const filteredBookings = myBookings.filter(b => {
    if (filters.status && b.status !== filters.status) return false;
    if (filters.date && b.bookingDate !== filters.date) return false;
    if (filters.resourceType && b.resourceType !== filters.resourceType) return false;
    return true;
  });

  return (
    <div className="t-my-bookings-page">
      <div className="t-mbp-header">
        <div className="t-mbp-title-area">
          <h1>My Bookings History</h1>
          <p>Track, manage, and review all of your campus facility requests.</p>
        </div>
        <button className="t-mbp-btn-new" onClick={() => navigate('/bookings/new')}>
          + New Booking
        </button>
      </div>

      <div className="t-mbp-layout">
        <div className="t-mbp-sidebar">
          {/* Reusable Sidebar Inject Target */}
          <T_BookingFilters 
            filters={filters}
            setFilters={setFilters}
            onApply={handleApplyFilters}
            onReset={handleResetFilters}
          />
        </div>

        <div className="t-mbp-main">
          <div className="t-mbp-controls">
            <span>Showing {filteredBookings.length} Result(s)</span>
            <div className="t-mbp-view-toggles">
              <button 
                className={`t-toggle-btn ${viewMode === 'card' ? 'active' : ''}`}
                onClick={() => setViewMode('card')}
              >
                🗂️ Cards
              </button>
              <button 
                className={`t-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
                onClick={() => setViewMode('table')}
              >
                📊 Table
              </button>
            </div>
          </div>

          <div className="t-mbp-content">
            {loading ? (
              <div className="t-mbp-empty">
                <h3>Loading...</h3>
                <p>Retrieving your bookings securely from the unified database.</p>
              </div>
            ) : error ? (
              <div className="t-mbp-empty">
                <h3>System Error</h3>
                <p>{error}</p>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="t-mbp-empty">
                <h3>No Bookings Found</h3>
                <p>You haven't made any bookings that logically match these particular filters.</p>
              </div>
            ) : (
              viewMode === 'card' ? (
                <div className="t-mbp-grid">
                  {filteredBookings.map(booking => (
                    <T_BookingCard
                      key={booking.id}
                      booking={booking}
                      userRole={user?.role?.toLowerCase() || 'student'}
                      onView={() => navigate(`/bookings/${booking.id}`)}
                      onCancel={handleCancelBooking}
                    />
                  ))}
                </div>
              ) : (
                <T_BookingTable 
                  bookings={filteredBookings}
                  onView={(b) => navigate(`/bookings/${b.id}`)}
                  onCancel={handleCancelBooking}
                  // Security lock: The student role naturally disables any admin 'onApprove' / 'onReject' functions internally. 
                />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default T_MyBookingsPage;
