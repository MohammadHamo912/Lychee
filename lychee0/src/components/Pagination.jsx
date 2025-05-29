import React from "react";
import "../ComponentsCss/Pagination.css";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage = 5, // Controls how many page numbers to show
  showArrows = true, // Toggle Previous/Next arrows
}) => {
  const halfRange = Math.floor(itemsPerPage / 2);
  let startPage = Math.max(1, currentPage - halfRange);
  let endPage = Math.min(totalPages, startPage + itemsPerPage - 1);

  if (endPage - startPage + 1 < itemsPerPage) {
    startPage = Math.max(1, endPage - itemsPerPage + 1);
  }

  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  return (
    <div className="pagination">
      {showArrows && (
        <button
          className="pagination-button pagination-arrow"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          &larr;
        </button>
      )}
      {startPage > 1 && (
        <>
          <button className="pagination-button" onClick={() => onPageChange(1)}>
            1
          </button>
          {startPage > 2 && <span className="pagination-ellipsis">...</span>}
        </>
      )}

      {pages.map((page) => (
        <button
          key={page}
          className={`pagination-button ${page === currentPage ? "active" : ""}`}
          onClick={() => onPageChange(page)}
          aria-label={`Page ${page}`}
        >
          {page}
        </button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && (
            <span className="pagination-ellipsis">...</span>
          )}
          <button
            className="pagination-button"
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </button>
        </>
      )}

      {showArrows && (
        <button
          className="pagination-button pagination-arrow"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          &rarr;
        </button>
      )}
    </div>
  );
};

export default Pagination;
