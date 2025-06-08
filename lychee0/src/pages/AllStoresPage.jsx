import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import SearchBar from "../components/SearchBar";
import StoreFiltersPanel from "../components/StoreFiltersPanel"; // Updated component
import Footer from "../components/Footer";
import StoreGrid from "../components/StoreGrid";
import { getAllStores } from "../api/stores";
import "../PagesCss/AllStoresPage.css";

const AllStoresPage = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("query") || "";

  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [activeFilters, setActiveFilters] = useState({
    minRating: 0,
    location: "",
    sortOption: "none",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch stores from API on component mount
  useEffect(() => {
    fetchStores();
  }, []);

  // Apply filters when stores data or initial query changes
  useEffect(() => {
    if (stores.length > 0) {
      applyFiltersAndSearch(initialQuery, activeFilters);
    }
  }, [initialQuery, stores]);

  const fetchStores = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllStores();
      setStores(data);
    } catch (err) {
      console.error("Error fetching stores:", err);
      setError("Failed to load stores. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    fetchStores();
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    applyFiltersAndSearch(term, activeFilters);
  };

  const handleApplyFilters = (filters) => {
    setActiveFilters(filters);
    applyFiltersAndSearch(searchTerm, filters);
  };

  const applyFiltersAndSearch = (search = "", filters = {}) => {
    const { minRating, location, sortOption } = filters;

    let result = [...stores];

    // Minimum rating filtering
    if (minRating > 0) {
      result = result.filter((store) => (store.rating || 0) >= minRating);
    }

    // Enhanced location filtering with partial matching
    if (location && location.trim()) {
      const lowerLocation = location.toLowerCase();
      result = result.filter((store) => {
        // Check if any part of the location input matches any part of store location data
        const searchTerms = lowerLocation
          .split(/[,\s-]+/)
          .filter((term) => term.length > 0);

        const storeLocationText = [
          store.city || "",
          store.country || "",
          store.address || "",
          `${store.city || ""}, ${store.country || ""}`
            .replace(", ,", ",")
            .replace(/^,|,$/, ""),
        ]
          .join(" ")
          .toLowerCase();

        // Check if ANY search term is found in ANY part of the store location
        return searchTerms.some(
          (term) =>
            storeLocationText.includes(term) ||
            (store.city && store.city.toLowerCase().includes(term)) ||
            (store.country && store.country.toLowerCase().includes(term)) ||
            (store.address && store.address.toLowerCase().includes(term))
        );
      });
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
      case "nameZA":
        result.sort((a, b) =>
          b.name.toLowerCase().localeCompare(a.name.toLowerCase())
        );
        break;
      case "highestRated":
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "mostReviewed":
        result.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
        break;
      case "leastReviewed":
        result.sort((a, b) => (a.reviewCount || 0) - (b.reviewCount || 0));
        break;
      default:
        // Keep original order or sort by ID/creation date
        break;
    }

    setFilteredStores(result);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    // Reset filters completely
    const resetFilters = {
      minRating: 0,
      location: "",
      sortOption: "none",
    };
    setActiveFilters(resetFilters);
    applyFiltersAndSearch("", resetFilters);
  };

  // Count active filters for display
  const getActiveFilterCount = () => {
    let count = 0;
    if (activeFilters.minRating > 0) count++;
    if (activeFilters.location.trim()) count++;
    if (activeFilters.sortOption !== "none") count++;
    return count;
  };

  return (
    <div className="stores-page">
      <NavBar />

      <div className="stores-hero">
        <div className="stores-hero-content">
          <h1>Discover Beauty Stores</h1>
          <p>
            Find your favorite beauty brands and unique products from around the
            world
          </p>
          <div className="search-container">
            <SearchBar searchType="stores" onSearch={handleSearch} />
          </div>
        </div>
      </div>

      <div className="stores-content">
        <div className="stores-sidebar">
          <h2>
            Filter Stores
            {getActiveFilterCount() > 0 && (
              <span className="filter-count">({getActiveFilterCount()})</span>
            )}
          </h2>
          <StoreFiltersPanel
            onApplyFilters={handleApplyFilters}
            stores={stores} // Pass stores for location suggestions
          />
        </div>

        <div className="stores-main">
          <div className="stores-results-header">
            <h2>
              All Stores
              {filteredStores.length > 0 && ` (${filteredStores.length})`}
            </h2>
            {searchTerm && (
              <div className="search-results-info">
                Showing results for: <span>"{searchTerm}"</span>
                <button onClick={handleClearSearch}>Clear Search</button>
              </div>
            )}
          </div>

          {error ? (
            <div className="error-message">
              <h3>Error Loading Stores</h3>
              <p>{error}</p>
              <button onClick={handleRetry} className="retry-btn">
                Try Again
              </button>
            </div>
          ) : isLoading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading stores...</p>
            </div>
          ) : filteredStores.length > 0 ? (
            <StoreGrid
              stores={filteredStores}
              title=""
              header=""
              className="all-store-page"
              isLoading={false}
              error={null}
            />
          ) : (
            <div className="no-results">
              <h3>No stores found</h3>
              <p>
                {getActiveFilterCount() > 0 || searchTerm
                  ? "Try adjusting your filters or search term"
                  : "No stores available at the moment"}
              </p>
              <button onClick={handleClearSearch} className="reset-search-btn">
                Clear All Filters
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
