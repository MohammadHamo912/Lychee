import React, { useState, useEffect } from "react";

const StoreFiltersPanel = ({
  onApplyFilters,
  stores = [], // Pass all stores to extract unique locations
}) => {
  const [sortOption, setSortOption] = useState("none");
  const [minRating, setMinRating] = useState(0);
  const [location, setLocation] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Extract unique locations from stores with better matching
  useEffect(() => {
    if (stores.length > 0) {
      const allLocationParts = new Set();

      stores.forEach((store) => {
        // Add individual location components
        if (store.city) {
          allLocationParts.add(store.city.trim());
          // Add city parts (split by spaces, commas, etc.)
          store.city.split(/[,\s-]+/).forEach((part) => {
            if (part.trim().length > 2) {
              allLocationParts.add(part.trim());
            }
          });
        }

        if (store.country) {
          allLocationParts.add(store.country.trim());
          store.country.split(/[,\s-]+/).forEach((part) => {
            if (part.trim().length > 2) {
              allLocationParts.add(part.trim());
            }
          });
        }

        if (store.address) {
          // Add full address
          allLocationParts.add(store.address.trim());
          // Add address parts
          store.address.split(/[,\s-]+/).forEach((part) => {
            if (part.trim().length > 2) {
              allLocationParts.add(part.trim());
            }
          });
        }

        // Add combined formats
        if (store.city && store.country) {
          allLocationParts.add(`${store.city}, ${store.country}`);
        }
      });

      // Convert to array and sort
      const uniqueLocations = Array.from(allLocationParts)
        .filter((loc) => loc && loc.length > 0)
        .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

      setLocationSuggestions(uniqueLocations);
    }
  }, [stores]);

  const handleApply = () => {
    onApplyFilters({
      sortOption,
      minRating,
      location: location.trim(),
    });
  };

  const handleReset = () => {
    setSortOption("none");
    setMinRating(0);
    setLocation("");
    setShowSuggestions(false);
    onApplyFilters({
      sortOption: "none",
      minRating: 0,
      location: "",
    });
  };

  const handleStarClick = (rating) => {
    setMinRating(minRating === rating ? 0 : rating);
  };

  const handleLocationChange = (e) => {
    const value = e.target.value;
    setLocation(value);
    setShowSuggestions(value.length > 0);
  };

  const handleLocationSelect = (selectedLocation) => {
    setLocation(selectedLocation);
    setShowSuggestions(false);
  };

  const filteredLocationSuggestions = locationSuggestions
    .filter((loc) => loc.toLowerCase().includes(location.toLowerCase()))
    .slice(0, 10); // Increased to 10 suggestions for better coverage

  return (
    <div style={styles.filtersPanel}>
      <h2 style={styles.title}>Filter Stores</h2>

      {/* Location Filter */}
      <div style={styles.filterGroup}>
        <label style={styles.label}>Location</label>
        <div style={styles.locationContainer}>
          <input
            type="text"
            value={location}
            onChange={handleLocationChange}
            onFocus={() => setShowSuggestions(location.length > 0)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="Search by city, country..."
            style={styles.locationInput}
          />
          {showSuggestions && filteredLocationSuggestions.length > 0 && (
            <div style={styles.suggestions}>
              {filteredLocationSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  style={styles.suggestionItem}
                  onClick={() => handleLocationSelect(suggestion)}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Minimum Rating Filter */}
      <div style={styles.filterGroup}>
        <label style={styles.label}>
          Minimum Rating {minRating > 0 && `(${minRating}+ stars)`}
        </label>
        <div style={styles.starContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              style={{
                ...styles.star,
                color: star <= minRating ? "#f5b301" : "#ccc",
              }}
              onClick={() => handleStarClick(star)}
            >
              ★
            </span>
          ))}
          {minRating > 0 && <span style={styles.ratingText}>& up</span>}
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
          <option value="none">Default</option>
          <option value="nameAZ">Name: A-Z</option>
          <option value="nameZA">Name: Z-A</option>
          <option value="highestRated">Highest Rated</option>
          <option value="mostReviewed">Most Reviewed</option>
          <option value="leastReviewed">Least Reviewed</option>
        </select>
      </div>

      {/* Active Filters Display */}
      {(minRating > 0 || location.trim() || sortOption !== "none") && (
        <div style={styles.activeFilters}>
          <h4 style={styles.activeFiltersTitle}>Active Filters:</h4>
          {minRating > 0 && (
            <span style={styles.filterTag}>Rating: {minRating}+ stars</span>
          )}
          {location.trim() && (
            <span style={styles.filterTag}>Location: {location}</span>
          )}
          {sortOption !== "none" && (
            <span style={styles.filterTag}>
              Sort:{" "}
              {sortOption === "nameAZ"
                ? "Name A-Z"
                : sortOption === "nameZA"
                ? "Name Z-A"
                : sortOption === "highestRated"
                ? "Highest Rated"
                : sortOption === "mostReviewed"
                ? "Most Reviewed"
                : sortOption === "leastReviewed"
                ? "Least Reviewed"
                : ""}
            </span>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div style={styles.buttonContainer}>
        <button style={styles.applyButton} onClick={handleApply}>
          Apply Filters
        </button>
        <button style={styles.clearButton} onClick={handleReset}>
          Clear All
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
  locationContainer: {
    position: "relative",
  },
  locationInput: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "6px",
    border: "1px solid #d9b6a3",
    backgroundColor: "white",
    color: "#4a2c2c",
    fontSize: "1rem",
    outline: "none",
    transition: "border-color 0.3s ease",
    boxSizing: "border-box",
  },
  suggestions: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "white",
    border: "1px solid #d9b6a3",
    borderTop: "none",
    borderRadius: "0 0 6px 6px",
    maxHeight: "200px",
    overflowY: "auto",
    zIndex: 1000,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  suggestionItem: {
    padding: "10px 12px",
    cursor: "pointer",
    borderBottom: "1px solid #f0f0f0",
    transition: "background-color 0.2s ease",
    fontSize: "0.9rem",
    color: "#4a2c2c",
  },
  starContainer: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  star: {
    fontSize: "1.5rem",
    cursor: "pointer",
    transition: "color 0.3s ease",
    userSelect: "none",
  },
  ratingText: {
    marginLeft: "8px",
    fontSize: "0.9rem",
    color: "#670010",
    fontWeight: "500",
  },
  activeFilters: {
    marginBottom: "20px",
    padding: "12px",
    backgroundColor: "#f8f8f8",
    borderRadius: "6px",
    border: "1px solid #e0e0e0",
  },
  activeFiltersTitle: {
    margin: "0 0 8px 0",
    fontSize: "0.9rem",
    color: "#670010",
    fontWeight: "bold",
  },
  filterTag: {
    display: "inline-block",
    backgroundColor: "#670010",
    color: "white",
    padding: "2px 8px",
    borderRadius: "12px",
    fontSize: "0.8rem",
    margin: "2px 4px 2px 0",
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

// Add hover effects via CSS-in-JS (you could also use a separate CSS file)
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = `
    .filters-panel select:hover,
    .filters-panel input:hover {
      border-color: #670010 !important;
    }
    
    .filters-panel .suggestion-item:hover {
      background-color: #f5f5f5 !important;
    }
    
    .filters-panel .apply-button:hover {
      background-color: #550010 !important;
    }
    
    .filters-panel .clear-button:hover {
      background-color: #670010 !important;
      color: white !important;
    }
  `;
  document.head.appendChild(styleSheet);
}

export default StoreFiltersPanel;
