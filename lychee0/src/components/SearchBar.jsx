import React from "react";

const Sidebar = ({ filters, handleFilterChange, clearFilters, categories }) => {
  const brands = [
    "Awesome Store",
    "Fashion Hub",
    "Glow Essentials",
    "Luxe Locks",
    "Scent Haven",
    "Beauty Boutique",
  ];
  const priceRanges = ["Under $25", "$25 - $50", "$50 - $100", "Over $100"];

  return (
    <div className="sidebar">
      <h3>Filters</h3>
      <button onClick={clearFilters}>Clear All</button>

      <div className="filter-section">
        <h4>Categories</h4>
        {categories.map((cat) => (
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
        <h4>Brands</h4>
        {brands.map((brand) => (
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
        <h4>Price Range</h4>
        {priceRanges.map((range) => (
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
    </div>
  );
};

export default Sidebar;
