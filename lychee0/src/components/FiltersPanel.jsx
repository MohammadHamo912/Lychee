import React, { useState } from 'react';
import '../ComponentsCss/FiltersPanel.css';

const FiltersPanel = ({ onApplyFilters, categories = [] }) => {
  const [category, setCategory] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortOption, setSortOption] = useState('none');

  const handleApply = () => {
    onApplyFilters({
      category,
      minPrice: minPrice ? parseFloat(minPrice) : null,
      maxPrice: maxPrice ? parseFloat(maxPrice) : null,
      sortOption,
    });
  };

  const handleReset = () => {
    setCategory('All');
    setMinPrice('');
    setMaxPrice('');
    setSortOption('none');

    onApplyFilters({
      category: 'All',
      minPrice: null,
      maxPrice: null,
      sortOption: 'none',
    });
  };

  return (
    <div className="filter-panel fixed-layout">
      <div className="filter-group">
        <label>Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="All">All</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Min Price</label>
        <input type="number" placeholder="e.g. 10" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
      </div>

      <div className="filter-group">
        <label>Max Price</label>
        <input type="number" placeholder="e.g. 100" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
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

      <div className="filter-actions">
        <button className="apply-button" onClick={handleApply}>Apply Filters</button>
        <button className="reset-button" onClick={handleReset}>Clear Filters</button>
      </div>
    </div>
  );
};

export default FiltersPanel;
