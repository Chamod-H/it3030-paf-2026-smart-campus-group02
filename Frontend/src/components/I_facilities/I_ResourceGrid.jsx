import React from 'react';
import I_ResourceCard from './I_ResourceCard';
import './I_ResourceGrid.css';

const I_ResourceGrid = ({ resources = [], loading = false, onViewDetails, onQuickBook }) => {
  if (loading) {
    return (
      <div className="resource-grid-loading">
        <div className="rg-spinner"></div>
        <p>Loading resources...</p>
      </div>
    );
  }

  if (!resources || resources.length === 0) {
    return (
      <div className="resource-grid-empty">
        <div className="rg-empty-icon">📂</div>
        <h3>No resources found</h3>
        <p>Try adjusting your search or filters to find what you're looking for.</p>
      </div>
    );
  }

  return (
    <div className="resource-grid">
      {resources.map((resource) => (
        <I_ResourceCard 
          key={resource.id || resource._id || Math.random().toString()} 
          resource={resource} 
          onViewDetails={onViewDetails}
          onQuickBook={onQuickBook}
        />
      ))}
    </div>
  );
};

export default I_ResourceGrid;
