import React, { useState } from "react";
import "../ComponentsCss/FiltersPanel.css";

const FiltersPanel = ({
    onApplyFilters,
    categories = ["Skincare", "Makeup", "Hair Care", "Fragrance"],
}) => {
    const [category, setCategory] = useState("All");
    const [reviewStars, setReviewStars] = useState(null);
    const [sortOption, setSortOption] = useState("none");

    const handleStarClick = (stars) => {
        setReviewStars((prev) => (prev === stars ? null : stars));
    };

    const handleApply = () => {
        onApplyFilters({
            category,
            reviewStars,
            sortOption,
        });
    };

    const handleReset = () => {
        setCategory("All");
        setReviewStars(null);
        setSortOption("none");
        onApplyFilters({
            category: "All",
            reviewStars: null,
            sortOption: "none",
        });
    };

    return (
        <div className="filters-panel">
            <div className="filter-group">
                <label htmlFor="category">Category</label>
                <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="All">All</option>
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>
            </div>

            <div className="filter-group" id="stars">
                <label>Reviews</label>
                <div className="star-filter">
                    {[5, 4, 3, 2, 1].map((star) => (
                        <span
                            key={star}
                            className={`star ${reviewStars === star ? "selected" : ""}`}
                            onClick={() => handleStarClick(star)}
                            title={`${star} star${star > 1 ? "s" : ""} & up`}
                        >
                            {"★".repeat(star)}
                        </span>
                    ))}
                </div>
            </div>

            <div className="filter-group">
                <label htmlFor="sortOption">Sort By</label>
                <select
                    id="sortOption"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                >
                    <option value="none">None</option>
                    <option value="mostReviewed">Most Reviewed</option>
                    <option value="leastReviewed">Least Reviewed</option>
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
