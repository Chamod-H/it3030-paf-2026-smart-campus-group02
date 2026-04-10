import React from 'react';
import './T_BookingFilters.css';

/**
 * Filter panel for Bookings (Used by both admin and advanced users)
 */
const T_BookingFilters = ({
  filters,
  setFilters,
  onApply,
  onReset
}) => {

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleReset = () => {
    onReset();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onApply();
  };

  return (
    <div className="t-booking-filters-container">
      <div className="t-bf-header">
        <h3>Filter Bookings</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="t-bf-form">
        <div className="t-bf-group">
          <label htmlFor="f-status">Booking Status</label>
          <select 
            id="f-status" 
            name="status" 
            value={filters.status || ''} 
            onChange={handleChange}
            className="t-bf-select"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        <div className="t-bf-group">
          <label htmlFor="f-date">Specific Date</label>
          <input 
            type="date" 
            id="f-date" 
            name="date" 
            value={filters.date || ''} 
            onChange={handleChange}
            className="t-bf-input"
          />
        </div>

        <div className="t-bf-group">
          <label htmlFor="f-resourceType">Resource Type</label>
          <select 
            id="f-resourceType" 
            name="resourceType" 
            value={filters.resourceType || ''} 
            onChange={handleChange}
            className="t-bf-select"
          >
            <option value="">All Types</option>
            <option value="Lecture hall">Lecture Hall</option>
            <option value="Lab">Laboratory</option>
            <option value="Meeting room">Meeting Room</option>
            <option value="Equipment">Equipment</option>
          </select>
        </div>

        <div className="t-bf-group">
          <label htmlFor="f-userId">Requester (Admin Only)</label>
          <input 
            type="text" 
            id="f-userId" 
            name="userId" 
            value={filters.userId || ''} 
            onChange={handleChange}
            placeholder="Search exactly by User ID or Name"
            className="t-bf-input"
          />
        </div>

        <div className="t-bf-actions">
          <button type="button" className="t-bf-btn-reset" onClick={handleReset}>
            Reset All
          </button>
          <button type="submit" className="t-bf-btn-apply">
            Apply Filters
          </button>
        </div>
      </form>
    </div>
  );
};

export default T_BookingFilters;
