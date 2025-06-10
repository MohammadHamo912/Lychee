import React, { useState, useEffect } from "react";
import "../ComponentsCss/StoreFiltersPanel.css"; // Assuming you have a CSS file

const StoreFiltersPanel = ({ onApplyFilters, activeFilters }) => {
  const [filters, setFilters] = useState({
    minRating: 0,
    sortOption: "none",
  });

  // Update filters when activeFilters prop changes (for reset functionality)
  useEffect(() => {
    if (activeFilters) {
      setFilters(activeFilters);
    }
  }, [activeFilters]);

  const handleFilterChange = (filterType, value) => {
    const updatedFilters = {
      ...filters,
      [filterType]: value,
    };
    setFilters(updatedFilters);
    onApplyFilters(updatedFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      minRating: 0,
      sortOption: "none",
    };
    setFilters(clearedFilters);
    onApplyFilters(clearedFilters);
  };

  const handleStarClick = (rating) => {
    const newRating = filters.minRating === rating ? 0 : rating;
    handleFilterChange("minRating", newRating);
  };

  return (
    <div className="filters-panel">
      {/* Minimum Rating Filter */}
      <div className="filter-group">
        <label>
          Minimum Rating{" "}
          {filters.minRating > 0 && `(${filters.minRating}+ stars)`}
        </label>
        <div className="star-rating-container">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`star ${star <= filters.minRating ? "filled" : ""}`}
              onClick={() => handleStarClick(star)}
            >
              ★
            </span>
          ))}
          {filters.minRating > 0 && <span className="rating-text">& up</span>}
        </div>
      </div>

      {/* Sort By Filter */}
      <div className="filter-group">
        <label>Sort By</label>
        <select
          value={filters.sortOption}
          onChange={(e) => handleFilterChange("sortOption", e.target.value)}
          className="filter-select"
        >
          <option value="none">Default</option>
          <option value="nameAZ">Name (A-Z)</option>
          <option value="nameZA">Name (Z-A)</option>
          <option value="highestRated">Highest Rated</option>
          <option value="mostReviewed">Most Reviewed</option>
          <option value="leastReviewed">Least Reviewed</option>
        </select>
      </div>

      {/* Clear Filters Button */}
      <button onClick={handleClearFilters} className="clear-filters-btn">
        Clear All Filters
      </button>
    </div>
  );
};

export default StoreFiltersPanel;
