import React, { useState } from 'react';
import './Shared_FilterPanel.css';

/**
 * Generic Filter Wrapper Component
 * Provides a highly consistent structural wrapper for any module's specific 
 * sorting and filtering inputs (e.g. date pickers, dropdowns, checkboxes).
 * 
 * @param {React.ReactNode} children - Dynamic filter inputs
 * @param {function} onApply - Triggered when user confirms filtering
 * @param {function} onReset - Triggered to clear all filters
 * @param {string} title - The header label of the panel
 * @param {boolean} defaultExpanded - Controls if the panel is open initially
 */
const Shared_FilterPanel = ({ 
  children, 
  onApply, 
  onReset, 
  title = "Filter & Sort",
  defaultExpanded = true 
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className="shared-filter-panel">
      {/* Clickable Header for Collapse/Expand mechanics */}
      <div 
        className="shared-filter-header" 
        onClick={() => setExpanded(!expanded)}
        role="button"
        aria-expanded={expanded}
        tabIndex={0}
        onKeyDown={(e) => { if(e.key === 'Enter') setExpanded(!expanded) }}
      >
        <div className="shared-filter-title">
          <span className="shared-filter-icon">🎛️</span>
          <h3>{title}</h3>
        </div>
        <span className={`shared-filter-chevron ${expanded ? 'open' : ''}`}>
          ▼
        </span>
      </div>

      {/* Accordion Body */}
      {expanded && (
        <div className="shared-filter-content">
          
          {/* Dynamic input injection slot */}
          <div className="shared-filter-body">
            {children}
          </div>
          
          {/* Standardized Control Actions */}
          <div className="shared-filter-actions">
            {onReset && (
              <button 
                type="button" 
                className="shared-filter-reset-btn" 
                onClick={onReset}
              >
                Clear All
              </button>
            )}
            
            {onApply && (
              <button 
                type="button" 
                className="shared-filter-apply-btn" 
                onClick={onApply}
              >
                Apply Filters
              </button>
            )}
          </div>

        </div>
      )}
    </div>
  );
};

export default Shared_FilterPanel;
