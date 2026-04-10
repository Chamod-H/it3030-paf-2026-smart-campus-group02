import React from 'react';
import './C_TicketFilters.css';

/**
 * Universal layout filter component for mathematically narrowing down incident tickets globally across varying Module C page views.
 */
const C_TicketFilters = ({
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

  // Maps physical keyboard event listeners explicitly
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onApply) {
      onApply();
    }
  };

  return (
    <div className="c-ticket-filters">
      <div className="c-tf-header">
        <h3>Filter Tickets</h3>
        <button className="c-tf-reset-btn" onClick={onReset}>Clear All</button>
      </div>

      <div className="c-tf-body">
        {/* Status Filter Bounds */}
        <div className="c-tf-group">
          <label htmlFor="status">Current Status</label>
          <select id="status" name="status" value={filters.status || ''} onChange={handleChange}>
            <option value="">All Statuses</option>
            <option value="OPEN">Open (New)</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        {/* Priority Filter Bounds */}
        <div className="c-tf-group">
          <label htmlFor="priority">Priority Level</label>
          <select id="priority" name="priority" value={filters.priority || ''} onChange={handleChange}>
            <option value="">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical / Urgent</option>
          </select>
        </div>

        {/* Category Filter Bounds */}
        <div className="c-tf-group">
          <label htmlFor="category">Issue Category</label>
          <select id="category" name="category" value={filters.category || ''} onChange={handleChange}>
            <option value="">All Categories</option>
            <option value="HVAC">HVAC</option>
            <option value="PLUMBING">Plumbing</option>
            <option value="ELECTRICAL">Electrical</option>
            <option value="AV_EQUIPMENT">AV / IT Equipment</option>
            <option value="STRUCTURAL">Structural Damage</option>
            <option value="CLEANING">Cleaning / Hygiene</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        {/* Resource/Location Mapping */}
        <div className="c-tf-group">
          <label htmlFor="resourceType">Target Location</label>
          <input 
            type="text" 
            id="resourceType" 
            name="resourceType" 
            placeholder="e.g. Auditorium A" 
            value={filters.resourceType || ''} 
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Technician / Assignee Bounds */}
        <div className="c-tf-group">
          <label htmlFor="technicianId">Assigned Technician</label>
          <input 
            type="text" 
            id="technicianId" 
            name="technicianId" 
            placeholder="Search Tech name or ID" 
            value={filters.technicianId || ''} 
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Dynamic Date Instantiation */}
        <div className="c-tf-group">
          <label htmlFor="date">Date Created</label>
          <input 
            type="date" 
            id="date" 
            name="date" 
            value={filters.date || ''} 
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="c-tf-footer">
        <button className="c-tf-apply-btn" onClick={onApply}>
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default C_TicketFilters;
