import React, { useState } from "react";

const FiltersPanel = ({
  onApplyFilters,
  categories = ["Skincare", "Makeup", "Hair Care", "Fragrance"],
}) => {
  const [category, setCategory] = useState("All");
  const [sortOption, setSortOption] = useState("none");
  const [selectedRating, setSelectedRating] = useState(0);

  const handleApply = () => {
    onApplyFilters({
      category,
      sortOption,
      rating: selectedRating,
    });
  };

  const handleReset = () => {
    setCategory("All");
    setSortOption("none");
    setSelectedRating(0);
    onApplyFilters({
      category: "All",
      minPrice: null,
      maxPrice: null,
      sortOption: "none",
      rating: 0,
    });
  };

  const handleStarClick = (rating) => {
    setSelectedRating(selectedRating === rating ? 0 : rating);
  };

  return (
    <div style={styles.filtersPanel}>
      <h2 style={styles.title}>Filter Stores</h2>

      {/* Category Filter */}
      <div style={styles.filterGroup}>
        <label style={styles.label}>Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={styles.select}
        >
          <option value="All">All</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Reviews Filter */}
      <div style={styles.filterGroup}>
        <label style={styles.label}>Reviews</label>
        <div style={styles.starContainer}>
          <div style={styles.starRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                style={{
                  ...styles.star,
                  color: star <= selectedRating ? "#f5b301" : "#ccc",
                }}
                onClick={() => handleStarClick(star)}
              >
                ★
              </span>
            ))}
          </div>
          <div style={styles.starRow}>
            {[1, 2, 3].map((star) => (
              <span
                key={`second-${star}`}
                style={{
                  ...styles.star,
                  color:
                    star <= Math.max(0, selectedRating - 5)
                      ? "#f5b301"
                      : "#ccc",
                }}
                onClick={() => handleStarClick(star + 5)}
              >
                ★
              </span>
            ))}
            <span style={styles.star}>★</span>
            <span style={styles.star}>★</span>
          </div>
        </div>
      </div>

      {/* Sort By Filter */}
      <div style={styles.filterGroup}>
        <label style={styles.label}>Sort By</label>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          style={styles.select}
        >
          <option value="none">None</option>
          <option value="priceLowToHigh">Price: Low to High</option>
          <option value="priceHighToLow">Price: High to Low</option>
          <option value="nameAZ">Name: A-Z</option>
        </select>
      </div>

      {/* Action Buttons */}
      <div style={styles.buttonContainer}>
        <button style={styles.applyButton} onClick={handleApply}>
          Apply Filters
        </button>
        <button style={styles.clearButton} onClick={handleReset}>
          Clear Filters
        </button>
      </div>
    </div>
  );
};

const styles = {
  filtersPanel: {
    backgroundColor: "#fff5e1",
    border: "1px solid #d9b6a3",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 2px 10px rgba(139, 60, 93, 0.1)",
    maxWidth: "320px",
    width: "100%",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    color: "#670010",
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: "24px",
    marginTop: "0",
    textAlign: "center",
  },
  filterGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    fontWeight: "bold",
    color: "#670010",
    marginBottom: "8px",
    fontSize: "1rem",
  },
  select: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "6px",
    border: "1px solid #d9b6a3",
    backgroundColor: "white",
    color: "#4a2c2c",
    fontSize: "1rem",
    cursor: "pointer",
    outline: "none",
    transition: "border-color 0.3s ease",
  },
  starContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  starRow: {
    display: "flex",
    gap: "4px",
  },
  star: {
    fontSize: "1.2rem",
    cursor: "pointer",
    transition: "color 0.3s ease",
    userSelect: "none",
  },
  priceInputs: {
    display: "flex",
    gap: "10px",
  },
  priceInput: {
    flex: 1,
    padding: "10px 12px",
    borderRadius: "6px",
    border: "1px solid #d9b6a3",
    backgroundColor: "white",
    color: "#4a2c2c",
    fontSize: "1rem",
    outline: "none",
    transition: "border-color 0.3s ease",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginTop: "28px",
  },
  applyButton: {
    width: "100%",
    padding: "12px 16px",
    fontSize: "1rem",
    fontWeight: "bold",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#670010",
    color: "white",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    outline: "none",
  },
  clearButton: {
    width: "100%",
    padding: "12px 16px",
    fontSize: "1rem",
    fontWeight: "bold",
    borderRadius: "8px",
    border: "2px solid #670010",
    backgroundColor: "white",
    color: "#670010",
    cursor: "pointer",
    transition: "all 0.3s ease",
    outline: "none",
  },
};

export default FiltersPanel;
