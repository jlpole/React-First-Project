
import React from 'react';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  showingCount,
  totalCount,
  itemLabel = 'items'
}) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="mt-8 flex justify-between items-center">
      <p className="text-gray-600">
        Showing {showingCount} of {totalCount} {itemLabel}
      </p>
      
      <nav className="flex items-center space-x-2">
        <button 
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 bg-green-800 text-white transition-colors"
        >
          Previous
        </button>
        
        <span className="px-4 py-2 font-medium">
          {currentPage} / {totalPages}
        </span>
        
        <button 
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed bg-green-800 text-white hover:bg-gray-600 transition-colors"
        >
          Next
        </button>
      </nav>
    </div>
  );

};


export default Pagination;
