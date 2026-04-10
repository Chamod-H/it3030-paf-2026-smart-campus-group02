import React from 'react';
import './Shared_Pagination.css';

/**
 * Reusable Pagination Component
 * Manages list traversal logic for large datasets across the platform (users, tickets, facilities).
 * 
 * @param {number} currentPage - The currently active page index (1-based)
 * @param {number} totalPages - The maximum number of pages available
 * @param {function} onPageChange - Callback triggered when requesting a different page
 */
const Shared_Pagination = ({ 
  currentPage = 1, 
  totalPages = 1, 
  onPageChange 
}) => {
  
  // Guard against impossible states or single-page arrays
  if (!totalPages || totalPages <= 1) return null;

  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // Helper block to generate explicit page number buttons for faster traversal
  const renderPageNumbers = () => {
    const pages = [];
    
    // Simple windowing logic to avoid breaking layout on massive datasets
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);
    
    // Adjust logic if window hits the edges
    if (currentPage <= 3) endPage = Math.min(5, totalPages);
    if (currentPage >= totalPages - 2) startPage = Math.max(1, totalPages - 4);

    for (let i = startPage; i <= endPage; i++) {
        pages.push(
            <button
                key={i}
                type="button"
                className={`shared-page-number ${i === currentPage ? 'active' : ''}`}
                onClick={() => onPageChange(i)}
                aria-current={i === currentPage ? 'page' : undefined}
                aria-label={`Page ${i}`}
            >
                {i}
            </button>
        );
    }
    return pages;
  };

  return (
    <nav className="shared-pagination-wrapper" aria-label="Pagination Navigation">
      <div className="shared-pagination-controls">
        
        {/* Previous Action */}
        <button 
          type="button" 
          className="shared-pagination-btn shared-pagination-prev"
          onClick={handlePrev}
          disabled={currentPage === 1}
          aria-label="Previous Page"
        >
          <span className="pagination-chevron">«</span> Prev
        </button>

        {/* Dynamic Number Window */}
        <div className="shared-pagination-numbers desktop-only">
          {renderPageNumbers()}
        </div>

        {/* Mobile Fallback Context */}
        <div className="shared-pagination-context mobile-only">
            Page {currentPage} of {totalPages}
        </div>

        {/* Next Action */}
        <button 
          type="button" 
          className="shared-pagination-btn shared-pagination-next"
          onClick={handleNext}
          disabled={currentPage === totalPages}
          aria-label="Next Page"
        >
          Next <span className="pagination-chevron">»</span>
        </button>

      </div>
    </nav>
  );
};

export default Shared_Pagination;
