import React, { useState, useEffect } from "react";
import { getAllCategories, getSubcategories } from "../api/categories";
import "../PagesCss/ProductFiltersPanel.css";

const ProductFiltersPanel = ({ onApplyFilters, brands, activeFilters }) => {
  const [filters, setFilters] = useState({
    brand: "All",
    mainCategory: "All",
    subCategory: "All",
    subSubCategory: "All",
    features: "",
    sortOption: "none",
  });

  // Categories organized by level
  const [mainCategories, setMainCategories] = useState([]);
  const [availableSubCategories, setAvailableSubCategories] = useState([]);
  const [availableSubSubCategories, setAvailableSubSubCategories] = useState(
    []
  );

  const [loading, setLoading] = useState(true);

  // Update filters when activeFilters prop changes (for reset functionality)
  useEffect(() => {
    if (activeFilters) {
      setFilters(activeFilters);
    }
  }, [activeFilters]);

  // Load main categories on component mount
  useEffect(() => {
    const fetchMainCategories = async () => {
      try {
        setLoading(true);
        const allCategories = await getAllCategories();
        // Filter for level 0 categories (main categories)
        const level0Categories = allCategories.filter((cat) => cat.level === 0);
        setMainCategories(level0Categories);
      } catch (error) {
        console.error("Error fetching main categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMainCategories();
  }, []);

  // Update available subcategories when main category changes
  useEffect(() => {
    const fetchSubCategories = async () => {
      if (filters.mainCategory === "All") {
        setAvailableSubCategories([]);
        setAvailableSubSubCategories([]);
        return;
      }

      try {
        const selectedMainCategory = mainCategories.find(
          (cat) => cat.name === filters.mainCategory
        );

        if (selectedMainCategory) {
          const subCats = await getSubcategories(
            selectedMainCategory.categoryId
          );
          setAvailableSubCategories(subCats);

          // Reset sub-sub categories when main category changes
          setAvailableSubSubCategories([]);

          // Only reset dependent filters if they're not already "All"
          if (
            filters.subCategory !== "All" ||
            filters.subSubCategory !== "All"
          ) {
            const updatedFilters = {
              ...filters,
              subCategory: "All",
              subSubCategory: "All",
            };
            setFilters(updatedFilters);
            onApplyFilters(updatedFilters);
          }
        }
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };

    fetchSubCategories();
  }, [filters.mainCategory, mainCategories]);

  // Update available sub-sub categories when sub category changes
  useEffect(() => {
    const fetchSubSubCategories = async () => {
      if (filters.subCategory === "All") {
        setAvailableSubSubCategories([]);
        return;
      }

      try {
        const selectedSubCategory = availableSubCategories.find(
          (cat) => cat.name === filters.subCategory
        );

        if (selectedSubCategory) {
          const subSubCats = await getSubcategories(
            selectedSubCategory.categoryId
          );
          setAvailableSubSubCategories(subSubCats);

          // Only reset sub-sub category filter if it's not already "All"
          if (filters.subSubCategory !== "All") {
            const updatedFilters = {
              ...filters,
              subSubCategory: "All",
            };
            setFilters(updatedFilters);
            onApplyFilters(updatedFilters);
          }
        }
      } catch (error) {
        console.error("Error fetching sub-sub categories:", error);
      }
    };

    fetchSubSubCategories();
  }, [filters.subCategory, availableSubCategories]);

  const handleFilterChange = (filterType, value) => {
    const updatedFilters = {
      ...filters,
      [filterType]: value,
    };
    setFilters(updatedFilters);
    onApplyFilters(updatedFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      brand: "All",
      mainCategory: "All",
      subCategory: "All",
      subSubCategory: "All",
      features: "",
      sortOption: "none",
    };
    setFilters(clearedFilters);
    setAvailableSubCategories([]);
    setAvailableSubSubCategories([]);
    onApplyFilters(clearedFilters);
  };

  return (
    <div className="filters-panel">
      {/* Brand Filter */}
      <div className="filter-group">
        <label>Brand</label>
        <select
          value={filters.brand}
          onChange={(e) => handleFilterChange("brand", e.target.value)}
          className="filter-select"
        >
          <option value="All">All Brands</option>
          {brands &&
            brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
        </select>
      </div>

      {/* Main Category Filter (Level 0) */}
      <div className="filter-group">
        <label>Main Category</label>
        <select
          value={filters.mainCategory}
          onChange={(e) => handleFilterChange("mainCategory", e.target.value)}
          className="filter-select"
          disabled={loading}
        >
          <option value="All">All Categories</option>
          {mainCategories.map((category) => (
            <option key={category.categoryId} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Sub Category Filter (Level 1) */}
      {availableSubCategories.length > 0 && (
        <div className="filter-group">
          <label>Sub Category</label>
          <select
            value={filters.subCategory}
            onChange={(e) => handleFilterChange("subCategory", e.target.value)}
            className="filter-select"
          >
            <option value="All">All Sub Categories</option>
            {availableSubCategories.map((category) => (
              <option key={category.categoryId} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Sub-Sub Category Filter (Level 2) */}
      {availableSubSubCategories.length > 0 && (
        <div className="filter-group">
          <label>Specific Category</label>
          <select
            value={filters.subSubCategory}
            onChange={(e) =>
              handleFilterChange("subSubCategory", e.target.value)
            }
            className="filter-select"
          >
            <option value="All">All Specific Categories</option>
            {availableSubSubCategories.map((category) => (
              <option key={category.categoryId} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Features Filter (Text Input) */}
      <div className="filter-group">
        <label>Features</label>
        <input
          type="text"
          value={filters.features}
          onChange={(e) => handleFilterChange("features", e.target.value)}
          className="filter-input"
          placeholder="Enter desired features (e.g., Vegan, Long-Lasting)"
        />
      </div>

      {/* Sort By Filter */}
      <div className="filter-group">
        <label>Sort By</label>
        <select
          value={filters.sortOption}
          onChange={(e) => handleFilterChange("sortOption", e.target.value)}
          className="filter-select"
        >
          <option value="none">Default</option>
          <option value="nameAZ">Name (A-Z)</option>
          <option value="nameZA">Name (Z-A)</option>
          <option value="priceLowHigh">Price (Low to High)</option>
          <option value="priceHighLow">Price (High to Low)</option>
          <option value="mostReviewed">Most Reviewed</option>
          <option value="leastReviewed">Least Reviewed</option>
        </select>
      </div>

      {/* Clear Filters Button */}
      <button onClick={handleClearFilters} className="clear-filters-btn">
        Clear All Filters
      </button>
    </div>
  );
};

export default ProductFiltersPanel;
