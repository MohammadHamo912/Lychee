import React, { useState } from "react";
import "../ComponentsCss/Sidebar.css";

const Sidebar = ({
  onApplyFilters,
  onClearFilters,
  initialFilters = {
    categories: [],
    features: [],
    brands: [],
    priceRange: "",
    minPrice: "",
    maxPrice: "",
    sortOption: "none",
    isNew: false,
  },
}) => {
  const [filters, setFilters] = useState(initialFilters);

  const mainCategories = ["Skincare", "Makeup", "Hair Care", "Fragrance"];
  const featureOptions = [
    "Face Moisturizers",
    "Night Creams",
    "Gel Moisturizers",
    "Oil-Free",
  ];
  const brandOptions = ["La Mer", "Tatcha", "Drunk Elephant", "Sunday Riley"];
  const priceRangeOptions = [
    "Under $25",
    "$25 - $50",
    "$50 - $100",
    "Over $100",
  ];
  const sortOptions = [
    { value: "none", label: "None" },
    { value: "priceLowToHigh", label: "Price: Low to High" },
    { value: "priceHighToLow", label: "Price: High to Low" },
    { value: "nameAZ", label: "Name: A-Z" },
    { value: "ratingHighToLow", label: "Rating: High to Low" },
  ];

  const handleCheckbox = (key, value, checked) => {
    setFilters((prev) => ({
      ...prev,
      [key]: checked
        ? [...prev[key], value]
        : prev[key].filter((item) => item !== value),
    }));
  };

  const handleRadio = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
  };

  const handleReset = () => {
    const cleared = {
      categories: [],
      features: [],
      brands: [],
      priceRange: "",
      minPrice: "",
      maxPrice: "",
      sortOption: "none",
      isNew: false,
    };
    setFilters(cleared);
    onClearFilters?.();
    onApplyFilters(cleared);
  };

  return (
    <aside className="combined-filter-sidebar">
      {/* New Arrivals */}
      <div className="filter-section">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={filters.isNew || false}
            onChange={(e) => handleChange("isNew", e.target.checked)}
          />
          New Arrivals
        </label>
      </div>

      {/* Categories */}
      <div className="filter-section">
        <label>Categories</label>
        {mainCategories.map((cat) => (
          <label key={cat} className="checkbox-label">
            <input
              type="checkbox"
              checked={filters.categories.includes(cat)}
              onChange={(e) =>
                handleCheckbox("categories", cat, e.target.checked)
              }
            />
            {cat}
          </label>
        ))}
      </div>

      {/* Features */}
      <div className="filter-section">
        <label>Features</label>
        {featureOptions.map((feat) => (
          <label key={feat} className="checkbox-label">
            <input
              type="checkbox"
              checked={filters.features.includes(feat)}
              onChange={(e) =>
                handleCheckbox("features", feat, e.target.checked)
              }
            />
            {feat}
          </label>
        ))}
      </div>

      {/* Brands */}
      <div className="filter-section">
        <label>Brands</label>
        {brandOptions.map((brand) => (
          <label key={brand} className="checkbox-label">
            <input
              type="checkbox"
              checked={filters.brands.includes(brand)}
              onChange={(e) =>
                handleCheckbox("brands", brand, e.target.checked)
              }
            />
            {brand}
          </label>
        ))}
      </div>

      {/* Price Range */}
      <div className="filter-section">
        <label>Price Range</label>
        {priceRangeOptions.map((range) => (
          <label key={range} className="radio-label">
            <input
              type="radio"
              name="priceRange"
              checked={filters.priceRange === range}
              onChange={() => handleRadio("priceRange", range)}
            />
            {range}
          </label>
        ))}
      </div>

      {/* Custom Price Inputs */}
      <div className="filter-section">
        <label>Custom Price</label>
        <div id="price">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => handleChange("minPrice", e.target.value)}
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => handleChange("maxPrice", e.target.value)}
          />
        </div>
      </div>

      {/* Sort Option */}
      <div className="filter-section">
        <label>Sort By</label>
        <select
          id="sortBy"
          value={filters.sortOption}
          onChange={(e) => handleChange("sortOption", e.target.value)}
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Buttons */}
      <div className="filter-actions">
        <button className="apply-button" onClick={handleApply}>
          Apply Filters
        </button>
        <button className="reset-button" onClick={handleReset}>
          Clear Filters
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
