// components/Sidebar.jsx
import React from "react";
import "../ComponentsCss/Sidebar.css";
const Sidebar = ({ filters, handleFilterChange, clearFilters }) => {
  const categoryOptions = [
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

  return (
    <aside className="filters">
      <div className="filter-section">
        <h3>Categories</h3>
        {categoryOptions.map((cat) => (
          <label key={cat}>
            <input
              type="checkbox"
              checked={filters.categories.includes(cat)}
              onChange={(e) =>
                handleFilterChange("categories", cat, e.target.checked)
              }
            />
            {cat}
          </label>
        ))}
      </div>
      <div className="filter-section">
        <h3>Brand</h3>
        {brandOptions.map((brand) => (
          <label key={brand}>
            <input
              type="checkbox"
              checked={filters.brands.includes(brand)}
              onChange={(e) =>
                handleFilterChange("brands", brand, e.target.checked)
              }
            />
            {brand}
          </label>
        ))}
      </div>
      <div className="filter-section">
        <h3>Price Range</h3>
        {priceRangeOptions.map((range) => (
          <label key={range}>
            <input
              type="radio"
              name="priceRange"
              checked={filters.priceRange === range}
              onChange={(e) =>
                handleFilterChange("priceRange", range, e.target.checked)
              }
            />
            {range}
          </label>
        ))}
      </div>
      <button className="clear-filters" onClick={clearFilters}>
        Clear All Filters
      </button>
    </aside>
  );
};

export default Sidebar;
