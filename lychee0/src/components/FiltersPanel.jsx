import React, { useState } from "react";
import "../ComponentsCss/FiltersPanel.css";

const FiltersPanel = ({ onApplyFilters }) => {
  const [category, setCategory] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortOption, setSortOption] = useState("none");

  const handleApply = () => {
    onApplyFilters({
      category,
      minPrice: minPrice ? parseFloat(minPrice) : null,
      maxPrice: maxPrice ? parseFloat(maxPrice) : null,
      sortOption,
    });
  };

  const handleReset = () => {
    setCategory("all");
    setMinPrice("");
    setMaxPrice("");
    setSortOption("none");

    onApplyFilters({
      category: "all",
      minPrice: null,
      maxPrice: null,
      sortOption: "none",
    });
  };

  return (
    <div className="filter-panel">
      <h3>Filters & Sorting</h3>

      <div className="filter-group">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="all">All</option>
          <option value="beauty">Beauty</option>
          <option value="skincare">Skincare</option>
          <option value="fragrance">Fragrance</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="minPrice">Min Price</label>
        <input
          id="minPrice"
          type="number"
          placeholder="e.g. 10"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
      </div>

      <div className="filter-group">
        <label htmlFor="maxPrice">Max Price</label>
        <input
          id="maxPrice"
          type="number"
          placeholder="e.g. 100"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </div>

      <div className="filter-group">
        <label htmlFor="sortOption">Sort By</label>
        <select
          id="sortOption"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="none">None</option>
          <option value="priceLowToHigh">Price: Low to High</option>
          <option value="priceHighToLow">Price: High to Low</option>
          <option value="nameAZ">Name: A-Z</option>
        </select>
      </div>

      <div className="filter-actions">
        <button className="apply-button" onClick={handleApply}>
          Apply Filters
        </button>
        <button className="reset-button" onClick={handleReset}>
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default FiltersPanel;
