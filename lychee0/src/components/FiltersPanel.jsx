import React, { useState } from 'react';
import '../ComponentsCss/FiltersPanel.css';

const FiltersPanel = ({ onApplyFilters }) => {
    // Local state for filters
    const [category, setCategory] = useState('all');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [rating, setRating] = useState('all');
    const [sortOption, setSortOption] = useState('none');

    const handleApply = () => {
        const filters = {
            category,
            minPrice: minPrice ? parseFloat(minPrice) : null,
            maxPrice: maxPrice ? parseFloat(maxPrice) : null,
            rating,
            sortOption,
        };
        if (onApplyFilters) {
            onApplyFilters(filters);
        }
    };

    return (
        <div className="filters-panel">
            <h3>Filters & Sorting</h3>
            <div className="filter-group">
                <label htmlFor="category">Category</label>
                <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="all">All</option>
                    <option value="beauty">Beauty</option>
                    <option value="fashion">Fashion</option>
                    <option value="bags">Bags</option>
                </select>
            </div>
            <div className="filter-group">
                <label htmlFor="minPrice">Min Price</label>
                <input
                    type="number"
                    id="minPrice"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="0"
                />
            </div>
            <div className="filter-group">
                <label htmlFor="maxPrice">Max Price</label>
                <input
                    type="number"
                    id="maxPrice"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="1000"
                />
            </div>
            <div className="filter-group">
                <label htmlFor="sortOption">Sort by</label>
                <select id="sortOption" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
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

export default FiltersPanel;
