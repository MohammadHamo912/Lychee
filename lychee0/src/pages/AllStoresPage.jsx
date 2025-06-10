import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import SearchBar from "../components/SearchBar";
import StoreFiltersPanel from "../components/StoreFiltersPanel";
import Footer from "../components/Footer";
import StoreGrid from "../components/StoreGrid";
import { getAllStores } from "../api/stores";
import { getReviews } from "../api/reviews";
import "../PagesCss/AllStoresPage.css";

const AllStoresPage = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("query") || "";

  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [activeFilters, setActiveFilters] = useState({
    minRating: 0,
    sortOption: "none",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [storeRatings, setStoreRatings] = useState({}); // Cache for store ratings
  const [storeReviewCounts, setStoreReviewCounts] = useState({}); // Cache for review counts

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

  // Function to calculate average rating and review count for a store
  const calculateStoreRatingAndCount = async (storeId) => {
    try {
      const reviews = await getReviews("shop", storeId);
      if (!reviews || reviews.length === 0) {
        return { rating: 0, reviewCount: 0 };
      }
      const totalRating = reviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      const avgRating = totalRating / reviews.length;
      return { rating: avgRating, reviewCount: reviews.length };
    } catch (error) {
      console.error(`Error fetching reviews for store ${storeId}:`, error);
      return { rating: 0, reviewCount: 0 };
    }
  };

  // Function to get or calculate rating and review count for a store (with caching)
  const getStoreRatingAndCount = async (storeId) => {
    if (
      storeRatings[storeId] !== undefined &&
      storeReviewCounts[storeId] !== undefined
    ) {
      return {
        rating: storeRatings[storeId],
        reviewCount: storeReviewCounts[storeId],
      };
    }

    const { rating, reviewCount } = await calculateStoreRatingAndCount(storeId);
    setStoreRatings((prev) => ({ ...prev, [storeId]: rating }));
    setStoreReviewCounts((prev) => ({ ...prev, [storeId]: reviewCount }));
    return { rating, reviewCount };
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

  // Enhanced search function that prioritizes store name matching
  const searchStoresByName = (storesList, searchQuery) => {
    if (!searchQuery || !searchQuery.trim()) {
      return storesList;
    }

    const query = searchQuery.toLowerCase().trim();

    return storesList.filter((store) => {
      // Primary search: Store name
      const storeName = (store.name || "").toLowerCase();

      // Check for exact match first
      if (storeName === query) {
        return true;
      }

      // Check if store name includes the search term
      if (storeName.includes(query)) {
        return true;
      }

      // Check if any word in store name starts with the search term
      const storeNameWords = storeName.split(/\s+/);
      if (storeNameWords.some((word) => word.startsWith(query))) {
        return true;
      }

      // Secondary search: Store description (less priority)
      const storeDescription = (store.description || "").toLowerCase();
      if (storeDescription.includes(query)) {
        return true;
      }

      // Tertiary search: Categories if available
      if (store.categories && Array.isArray(store.categories)) {
        return store.categories.some((category) =>
          category.toLowerCase().includes(query)
        );
      }

      return false;
    });
  };

  const applyFiltersAndSearch = async (search = "", filters = {}) => {
    const { minRating, sortOption } = filters;

    let result = [...stores];

    // Apply search first (prioritizing name search)
    if (search.trim()) {
      result = searchStoresByName(result, search);
    }

    // Minimum rating filtering - need to get actual ratings from reviews
    if (minRating > 0) {
      const storesWithRatings = await Promise.all(
        result.map(async (store) => {
          const storeId = store.storeId || store.id || store.Store_ID;
          const { rating } = await getStoreRatingAndCount(storeId);
          return { store, rating };
        })
      );

      result = storesWithRatings
        .filter(({ rating }) => rating >= minRating)
        .map(({ store }) => store);
    }

    // Sorting with enhanced name search relevance
    switch (sortOption) {
      case "nameAZ":
        result.sort((a, b) =>
          (a.name || "")
            .toLowerCase()
            .localeCompare((b.name || "").toLowerCase())
        );
        break;
      case "nameZA":
        result.sort((a, b) =>
          (b.name || "")
            .toLowerCase()
            .localeCompare((a.name || "").toLowerCase())
        );
        break;
      case "relevance":
        // Sort by search relevance if there's a search term
        if (search.trim()) {
          const query = search.toLowerCase().trim();
          result.sort((a, b) => {
            const aName = (a.name || "").toLowerCase();
            const bName = (b.name || "").toLowerCase();

            // Exact matches first
            if (aName === query && bName !== query) return -1;
            if (bName === query && aName !== query) return 1;

            // Names that start with the query
            if (aName.startsWith(query) && !bName.startsWith(query)) return -1;
            if (bName.startsWith(query) && !aName.startsWith(query)) return 1;

            // Names that include the query
            const aIncludes = aName.includes(query);
            const bIncludes = bName.includes(query);
            if (aIncludes && !bIncludes) return -1;
            if (bIncludes && !aIncludes) return 1;

            // Alphabetical as fallback
            return aName.localeCompare(bName);
          });
        }
        break;
      case "highestRated":
        // For rating sorting, we need to fetch ratings and sort accordingly
        const ratingsForSorting = await Promise.all(
          result.map(async (store) => {
            const storeId = store.storeId || store.id || store.Store_ID;
            const { rating } = await getStoreRatingAndCount(storeId);
            return { store, rating };
          })
        );
        ratingsForSorting.sort((a, b) => b.rating - a.rating);
        result = ratingsForSorting.map((item) => item.store);
        break;
      case "mostReviewed":
        const reviewCountsForSortingHigh = await Promise.all(
          result.map(async (store) => {
            const storeId = store.storeId || store.id || store.Store_ID;
            const { reviewCount } = await getStoreRatingAndCount(storeId);
            return { store, reviewCount };
          })
        );
        reviewCountsForSortingHigh.sort(
          (a, b) => b.reviewCount - a.reviewCount
        );
        result = reviewCountsForSortingHigh.map((item) => item.store);
        break;
      case "leastReviewed":
        const reviewCountsForSortingLow = await Promise.all(
          result.map(async (store) => {
            const storeId = store.storeId || store.id || store.Store_ID;
            const { reviewCount } = await getStoreRatingAndCount(storeId);
            return { store, reviewCount };
          })
        );
        reviewCountsForSortingLow.sort((a, b) => a.reviewCount - b.reviewCount);
        result = reviewCountsForSortingLow.map((item) => item.store);
        break;
      default:
        // If there's a search term but no specific sort, apply relevance sorting
        if (search.trim()) {
          const query = search.toLowerCase().trim();
          result.sort((a, b) => {
            const aName = (a.name || "").toLowerCase();
            const bName = (b.name || "").toLowerCase();

            if (aName === query && bName !== query) return -1;
            if (bName === query && aName !== query) return 1;
            if (aName.startsWith(query) && !bName.startsWith(query)) return -1;
            if (bName.startsWith(query) && !aName.startsWith(query)) return 1;

            return aName.localeCompare(bName);
          });
        }
        break;
    }

    setFilteredStores(result);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    // Reset filters completely
    const resetFilters = {
      minRating: 0,
      sortOption: "none",
    };
    setActiveFilters(resetFilters);
    applyFiltersAndSearch("", resetFilters);
  };

  // Count active filters for display
  const getActiveFilterCount = () => {
    let count = 0;
    if (activeFilters.minRating > 0) count++;
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
            <SearchBar
              searchType="stores"
              onSearch={handleSearch}
              placeholder="Search stores by name..."
              value={searchTerm}
            />
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
            activeFilters={activeFilters}
          />
        </div>

        <div className="stores-main">
          <div className="stores-results-header">
            <h2>
              {searchTerm ? `Search Results` : "All Stores"}
              {filteredStores.length > 0 && ` (${filteredStores.length})`}
            </h2>
            {searchTerm && (
              <div className="search-results-info">
                Showing results for: <span>"{searchTerm}"</span>
                <button
                  onClick={handleClearSearch}
                  className="clear-search-btn"
                >
                  Clear Search
                </button>
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
                {searchTerm
                  ? `No stores found matching "${searchTerm}"`
                  : getActiveFilterCount() > 0
                  ? "Try adjusting your filters"
                  : "No stores available at the moment"}
              </p>
              <button onClick={handleClearSearch} className="reset-search-btn">
                {searchTerm ? "Clear Search" : "Clear All Filters"}
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
