import React from 'react';
import './I_ResourceSearch.css';

const I_ResourceSearch = ({ searchTerm = '', setSearchTerm, onSearch }) => {
  const handleChange = (e) => {
    if (setSearchTerm) setSearchTerm(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch();
  };

  return (
    <div className="resource-search-container">
      <form onSubmit={handleSubmit} className="rs-form">
        <div className="rs-input-wrapper">
          <span className="rs-icon">🔍</span>
          <input 
            type="text" 
            className="rs-input" 
            placeholder="Search resources by name, type, or location..." 
            value={searchTerm}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="rs-button">
          Search
        </button>
      </form>
    </div>
  );
};

export default I_ResourceSearch;
