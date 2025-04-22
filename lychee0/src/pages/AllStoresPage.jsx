import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import SearchBar from "../components/SearchBar";
import StoreFiltersPanel from "../components/StoreFiltersPanel";
import ReusableGrid from "../components/ReusableGrid";
import StoreCard from "../components/StoreCard";
import Footer from "../components/Footer";
import dummyStores from "../Data/dummyStores";
import "../PagesCss/AllStoresPage.css";

const AllStoresPage = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("query") || "";

  const [stores] = useState(dummyStores);
  const [filteredStores, setFilteredStores] = useState([]);
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [activeFilters, setActiveFilters] = useState({
    category: "All",
    reviewStars: null,
    sortOption: "none",
  });
  const [isLoading, setIsLoading] = useState(false);

  const storeCategories = [
    "Beauty", "Skincare", "Makeup", "Luxury", "Korean", "Organic",
  ];

  useEffect(() => {
    applyFiltersAndSearch(initialQuery, activeFilters);
  }, [initialQuery, stores]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    applyFiltersAndSearch(term, activeFilters);
  };

  const handleApplyFilters = (filters) => {
    setActiveFilters(filters);
    applyFiltersAndSearch(searchTerm, filters);
  };

  const applyFiltersAndSearch = (search = "", filters = {}) => {
    setIsLoading(true);
    const { category, reviewStars, sortOption } = filters;

    let result = [...stores];

    // Category filtering
    if (category && category !== "All") {
      result = result.filter((store) =>
        store.categories?.some(
          (cat) => cat.toLowerCase() === category.toLowerCase()
        )
      );
    }

    // Review filtering
    if (reviewStars !== null) {
      result = result.filter(
        (store) => Math.floor(store.rating || 0) === reviewStars
      );
    }

    // Search filtering
    if (search.trim()) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(
        (store) =>
          store.name.toLowerCase().includes(lowerSearch) ||
          store.description.toLowerCase().includes(lowerSearch) ||
          store.categories?.some((cat) =>
            cat.toLowerCase().includes(lowerSearch)
          )
      );
    }

    // Sorting
    switch (sortOption) {
      case "nameAZ":
        result.sort((a, b) =>
          a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        );
        break;
      case "mostReviewed":
        result.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
        break;
      case "leastReviewed":
        result.sort((a, b) => (a.reviewCount || 0) - (b.reviewCount || 0));
        break;
      default:
        break;
    }

    setTimeout(() => {
      setFilteredStores(result);
      setIsLoading(false);
    }, 300);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    applyFiltersAndSearch("", activeFilters);
  };

  return (
    <div className="stores-page">
      <NavBar />

      <div className="stores-hero">
        <div className="stores-hero-content">
          <h1>Discover Beauty Stores</h1>
          <p>Find your favorite beauty brands and unique products from around the world</p>
          <div className="search-container">
            <SearchBar searchType="stores" onSearch={handleSearch} />
          </div>
        </div>
      </div>

      <div className="stores-content">
        <div className="stores-sidebar">
          <h2>Filter Stores</h2>
          <StoreFiltersPanel
            onApplyFilters={handleApplyFilters}
            categories={storeCategories}
          />
        </div>

        <div className="stores-main">
          <div className="stores-results-header">
            <h2>
              All Stores {filteredStores.length > 0 && `(${filteredStores.length})`}
            </h2>
            {searchTerm && (
              <div className="search-results-info">
                Showing results for: <span>"{searchTerm}"</span>
                <button onClick={handleClearSearch}>Clear Search</button>
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading stores...</p>
            </div>
          ) : filteredStores.length > 0 ? (
            <ReusableGrid
              items={filteredStores}
              CardComponent={StoreCard}
              itemPropName="store"
              className="stores-grid"
              gridStyle={{ gap: "30px" }}
              showViewAll={false}
            />
          ) : (
            <div className="no-results">
              <h3>No stores found</h3>
              <p>Try adjusting your filters or search term</p>
              <button onClick={handleClearSearch} className="reset-search-btn">
                Reset Search
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AllStoresPage;
