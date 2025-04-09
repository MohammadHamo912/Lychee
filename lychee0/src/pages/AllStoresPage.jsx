import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import SearchBar from "../components/SearchBar";
import FiltersPanel from "../components/FiltersPanel";
import ReusableGrid from "../components/ReusableGrid";
import StoreCard from "../components/StoreCard";
import Footer from "../components/Footer";
import dummyStores from "../Data/dummyStores";
import "../PagesCss/AllStoresPage.css";

const AllStoresPage = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("query") || "";

  const [stores, setStores] = useState(dummyStores);
  const [filteredStores, setFilteredStores] = useState(dummyStores);
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [storeCategories, setStoreCategories] = useState([
    "Beauty",
    "Skincare",
    "Makeup",
    "Luxury",
    "Korean",
    "Organic",
  ]);

  // Apply search from URL on initial load
  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, []);

  // Handle search from SearchBar
  const handleSearch = (term) => {
    setIsLoading(true);
    setSearchTerm(term);

    if (!term.trim()) {
      setFilteredStores(stores);
      setIsLoading(false);
      return;
    }

    const searchResults = stores.filter(
      (store) =>
        store.name.toLowerCase().includes(term.toLowerCase()) ||
        store.description.toLowerCase().includes(term.toLowerCase()) ||
        store.categories.some((cat) =>
          cat.toLowerCase().includes(term.toLowerCase())
        )
    );

    setTimeout(() => {
      setFilteredStores(searchResults);
      setIsLoading(false);
    }, 300); // Small delay to show loading state
  };

  // Handle filter application
  const handleApplyFilters = (filters) => {
    setIsLoading(true);

    let results = [...stores];

    // Filter by category
    if (filters.category && filters.category !== "All") {
      results = results.filter(
        (store) =>
          store.categories && store.categories.includes(filters.category)
      );
    }

    // Apply price filters if the stores have price ranges
    if (filters.minPrice) {
      results = results.filter((store) => {
        // Assuming stores have a minPrice or averagePrice property
        const storePrice = store.minPrice || store.averagePrice || 0;
        return storePrice >= filters.minPrice;
      });
    }

    if (filters.maxPrice) {
      results = results.filter((store) => {
        // Assuming stores have a maxPrice or averagePrice property
        const storePrice = store.maxPrice || store.averagePrice || Infinity;
        return storePrice <= filters.maxPrice;
      });
    }

    // Apply sorting
    if (filters.sortOption !== "none") {
      switch (filters.sortOption) {
        case "nameAZ":
          results.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "priceHighToLow":
          results.sort((a, b) => (b.averagePrice || 0) - (a.averagePrice || 0));
          break;
        case "priceLowToHigh":
          results.sort((a, b) => (a.averagePrice || 0) - (b.averagePrice || 0));
          break;
        default:
          break;
      }
    }

    // Apply current search term if exists
    if (searchTerm.trim()) {
      results = results.filter(
        (store) =>
          store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          store.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          store.categories.some((cat) =>
            cat.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    setTimeout(() => {
      setFilteredStores(results);
      setIsLoading(false);
    }, 300);
  };

  // Clear search and filters
  const handleClearSearch = () => {
    setSearchTerm("");
    setFilteredStores(stores);
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
          <h2>Filter Stores</h2>
          <FiltersPanel
            onApplyFilters={handleApplyFilters}
            categories={storeCategories}
          />
        </div>

        <div className="stores-main">
          <div className="stores-results-header">
            <h2>
              All Stores{" "}
              {filteredStores.length > 0 && `(${filteredStores.length})`}
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
