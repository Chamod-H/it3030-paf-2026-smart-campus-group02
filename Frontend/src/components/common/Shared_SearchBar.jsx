import React from 'react';
import './Shared_SearchBar.css';

/**
 * Reusable Search Bar Component
 * Provides a standardized text input tailored for searching, with integrated 
 * clear functionality and optional submit button.
 * 
 * @param {string} value - The controlled text value
 * @param {function} onChange - Callack fired on every keystroke
 * @param {function} onSearch - Callback fired on Enter key or Search button click
 * @param {string} placeholder - Placeholder text
 * @param {boolean} showSubmit - Whether to display a dedicated 'Search' button
 */
const Shared_SearchBar = ({ 
  value = "", 
  onChange, 
  onSearch, 
  placeholder = "Type to search...", 
  showSubmit = false 
}) => {

  const handleClear = () => {
    // Treat clear as typing an empty string to keep controlled state in sync
    if (onChange) {
      onChange({ target: { value: '' } });
    }
    // Optionally trigger the search API automatically upon clear
    if (onSearch) {
      onSearch('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onSearch) {
      e.preventDefault();
      onSearch(value);
    }
  };

  return (
    <div className="shared-search-container">
      <div className="shared-search-wrapper">
        <span className="shared-search-icon" aria-hidden="true">🔍</span>
        
        <input 
          type="text"
          className="shared-search-input"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
        />

        {/* Show clear button only if there is active text */}
        {value && value.length > 0 && (
          <button 
            type="button" 
            className="shared-search-clear-btn" 
            onClick={handleClear} 
            title="Clear search"
            aria-label="Clear Search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Optional distinct submit button */}
      {showSubmit && (
        <button 
          type="button" 
          className="shared-search-submit-btn" 
          onClick={() => onSearch && onSearch(value)}
        >
          Search
        </button>
      )}
    </div>
  );
};

export default Shared_SearchBar;
