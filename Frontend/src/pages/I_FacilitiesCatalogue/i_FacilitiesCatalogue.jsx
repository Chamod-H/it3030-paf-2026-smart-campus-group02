import React, { useState } from 'react';
import './i_FacilitiesCatalogue.css';

// Dummy data to demonstrate functionality without a backend yet
const initialResources = [
  { id: 1, name: 'Main Auditorium', type: 'Lecture Hall', capacity: 300, location: 'Block A, Level 1', availability: '08:00 - 20:00', status: 'ACTIVE' },
  { id: 2, name: 'Computer Lab 3', type: 'Lab', capacity: 40, location: 'Block B, Level 2', availability: '08:00 - 18:00', status: 'ACTIVE' },
  { id: 3, name: 'Meeting Room Alpha', type: 'Meeting Room', capacity: 10, location: 'Block C, Level 1', availability: '08:00 - 17:00', status: 'ACTIVE' },
  { id: 4, name: '4K Sony Projector', type: 'Equipment', capacity: 'N/A', location: 'IT Store', availability: '08:00 - 16:00', status: 'OUT_OF_SERVICE' },
  { id: 5, name: 'Physics Lab', type: 'Lab', capacity: 30, location: 'Block D, Level 1', availability: '09:00 - 17:00', status: 'ACTIVE' },
  { id: 6, name: 'Study Room 4', type: 'Meeting Room', capacity: 4, location: 'Library, Level 2', availability: '24/7', status: 'ACTIVE' },
];

const I_FacilitiesCatalogue = () => {
  const [resources, setResources] = useState(initialResources);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Handle Search and Filter logic
  const filteredResources = resources.filter(resource => {
    // Text search matches name or location
    const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          resource.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'All' || resource.type === typeFilter;
    const matchesStatus = statusFilter === 'All' || resource.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Extract unique types for the filter dropdown
  const uniqueTypes = ['All', ...new Set(initialResources.map(res => res.type))];

  return (
    <div className="facilities-container">
      <div className="catalogue-header">
        <h1>Facilities Catalogue</h1>
        <button className="add-resource-btn">
          <span>+ Add Resource</span>
        </button>
      </div>

      <div className="controls-section">
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search resources by name or location..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filters-wrapper">
          <select 
            className="filter-select"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            {uniqueTypes.map(type => (
              <option key={type} value={type}>{type === 'All' ? 'All Types' : type}</option>
            ))}
          </select>
          
          <select 
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="OUT_OF_SERVICE">Out of Service</option>
          </select>
        </div>
      </div>

      <div className="resources-grid">
        {filteredResources.length > 0 ? (
          filteredResources.map(resource => (
            <div className="resource-card" key={resource.id}>
              <div className="card-header">
                <div>
                  <h3 className="resource-title">{resource.name}</h3>
                  <span className="resource-type">{resource.type}</span>
                </div>
                <span className={`status-badge ${resource.status === 'ACTIVE' ? 'active' : 'out-of-service'}`}>
                  {resource.status === 'ACTIVE' ? 'Active' : 'Out of Service'}
                </span>
              </div>
              
              <div className="card-body">
                <div className="info-row">
                  <span className="info-icon">📍</span>
                  <span>{resource.location}</span>
                </div>
                <div className="info-row">
                  <span className="info-icon">👥</span>
                  <span>Capacity: {resource.capacity}</span>
                </div>
                <div className="info-row">
                  <span className="info-icon">🕒</span>
                  <span>Availability: {resource.availability}</span>
                </div>
              </div>
              
              <div className="card-footer">
                <button className="view-btn">View Details</button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <h3>No resources found</h3>
            <p>Try adjusting your search or filters to find what you're looking for.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default I_FacilitiesCatalogue;
