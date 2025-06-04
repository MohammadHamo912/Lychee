import React, { useState } from "react";
import "../PagesCss/ProductFiltersPanel.css";

const ProductFiltersPanel = ({ onApplyFilters, brands, categories }) => {
  const [filters, setFilters] = useState({
    brand: "All",
    category: "All",
    features: "", // Change to empty string for text input
    sortOption: "none",
  });

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
      brand: "All",
      category: "All",
      features: "",
      sortOption: "none",
    };
    setFilters(clearedFilters);
    onApplyFilters(clearedFilters);
  };

  return (
    <div className="filters-panel">
      {/* Brand Filter */}
      <div className="filter-group">
        <label>Brand</label>
        <select
          value={filters.brand}
          onChange={(e) => handleFilterChange("brand", e.target.value)}
          className="filter-select"
        >
          <option value="All">All Brands</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </div>

      {/* Category Filter */}
      <div className="filter-group">
        <label>Category</label>
        <select
          value={filters.category}
          onChange={(e) => handleFilterChange("category", e.target.value)}
          className="filter-select"
        >
          <option value="All">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Features Filter (Text Input) */}
      <div className="filter-group">
        <label>Features</label>
        <input
          type="text"
          value={filters.features}
          onChange={(e) => handleFilterChange("features", e.target.value)}
          className="filter-input"
          placeholder="Enter desired features (e.g., Vegan, Long-Lasting)"
        />
      </div>

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
          <option value="priceLowHigh">Price (Low to High)</option>
          <option value="priceHighLow">Price (High to Low)</option>
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

export default ProductFiltersPanel;
