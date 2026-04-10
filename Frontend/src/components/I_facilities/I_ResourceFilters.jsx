import React from 'react';
import './I_ResourceFilters.css';

const I_ResourceFilters = ({ filters, setFilters, onApply, onReset }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (setFilters) {
      setFilters(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleApply = (e) => {
    e.preventDefault();
    if (onApply) onApply();
  };

  const handleReset = () => {
    if (onReset) onReset();
  };

  return (
    <div className="resource-filters-container">
      <div className="rf-header">
        <div className="rf-title">
          <span>⚙️</span>
          <h4>Filter Resources</h4>
        </div>
      </div>
      
      <form onSubmit={handleApply} className="rf-form">
        <div className="rf-grid">
          {/* Type Filter */}
          <div className="rf-form-group">
            <label htmlFor="type">Resource Type</label>
            <select 
              id="type" 
              name="type" 
              value={filters?.type || ''} 
              onChange={handleChange}
              className="rf-input"
            >
              <option value="">All Types</option>
              <option value="Lecture hall">Lecture Hall</option>
              <option value="Lab">Laboratory</option>
              <option value="Meeting room">Meeting Room</option>
              <option value="Equipment">Equipment</option>
            </select>
          </div>

          {/* Location Filter */}
          <div className="rf-form-group">
            <label htmlFor="location">Location</label>
            <input 
              type="text" 
              id="location" 
              name="location" 
              placeholder="e.g. Block A, Room 101" 
              value={filters?.location || ''} 
              onChange={handleChange}
              className="rf-input"
            />
          </div>

          {/* Capacity Filter */}
          <div className="rf-form-group rf-capacity-group">
            <label>Capacity Range</label>
            <div className="rf-capacity-inputs">
              <input 
                type="number" 
                name="minCapacity" 
                placeholder="Min" 
                min="0"
                value={filters?.minCapacity || ''} 
                onChange={handleChange}
                className="rf-input"
              />
              <span className="rf-capacity-separator">-</span>
              <input 
                type="number" 
                name="maxCapacity" 
                placeholder="Max" 
                min="0"
                value={filters?.maxCapacity || ''} 
                onChange={handleChange}
                className="rf-input"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="rf-form-group">
            <label htmlFor="status">Status</label>
            <select 
              id="status" 
              name="status" 
              value={filters?.status || ''} 
              onChange={handleChange}
              className="rf-input"
            >
              <option value="">Any Status</option>
              <option value="ACTIVE">Active</option>
              <option value="OUT_OF_SERVICE">Out of Service</option>
            </select>
          </div>
        </div>

        <div className="rf-actions">
          <button type="button" onClick={handleReset} className="rf-btn rf-btn-reset">
            Reset Filters
          </button>
          <button type="submit" className="rf-btn rf-btn-apply">
            Apply Filters
          </button>
        </div>
      </form>
    </div>
  );
};

export default I_ResourceFilters;
