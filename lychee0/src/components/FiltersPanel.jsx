import React, { useState } from "react";
import "../ComponentsCss/FiltersPanel.css";

const FilterPanel = ({ onApplyFilters }) => {
  const [category, setCategory] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortOption, setSortOption] = useState("none");

  const handleApply = () => {
    onApplyFilters({
      category,
      minPrice,
      maxPrice,
      sortOption,
    });
  };

  return (
    <div className="filter-panel">
      <h3>Filters & Sorting</h3>

      <div className="filter-group">
        <label>Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">All</option>
          <option value="beauty">Beauty</option>
          <option value="skincare">Skincare</option>
          <option value="fragrance">Fragrance</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Min Price</label>
        <input
          type="number"
          placeholder="e.g. 10"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
      </div>

      <div className="filter-group">
        <label>Max Price</label>
        <input
          type="number"
          placeholder="e.g. 100"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </div>

      <div className="filter-group">
        <label>Sort By</label>
        <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
          <option value="none">None</option>
          <option value="priceLowToHigh">Price: Low to High</option>
          <option value="priceHighToLow">Price: High to Low</option>
          <option value="nameAZ">Name: A-Z</option>
        </select>
      </div>

      <button className="apply-button" onClick={handleApply}>
        Apply Filters
      </button>
    </div>
  );
};

export default FilterPanel;
