import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import NavBar from "../components/NavBar";
import SearchBar from "../components/SearchBar";
import FiltersPanel from "../components/FiltersPanel";
import "../PagesCss/SearchPage.css";

const SearchPage = ({ searchType = "products", data = [], renderCard }) => {
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const productCategories = ["Skincare", "Makeup", "Hair Care", "Fragrance"];

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const queryParam = searchParams.get("query");

    if (queryParam) {
      setQuery(queryParam);
      performSearch(queryParam);
    } else {
      setQuery("");
      setResults(data);
      setFilteredResults(data);
    }
  }, [location.search, data]);

  const performSearch = (term) => {
    setLoading(true);
    setTimeout(() => {
      const filtered = term
        ? data.filter((item) =>
            item.name.toLowerCase().includes(term.toLowerCase())
          )
        : [...data];
      setResults(filtered);
      setFilteredResults(filtered);
      setLoading(false);
    }, 400);
  };

  const applyFilters = (filters) => {
    let updated = [...results];

    console.log("Applying filters:", filters);
    console.log("First result sample:", results[0]);

    if (searchType === "products") {
      // Category
      if (filters.category && filters.category.toLowerCase() !== "all") {
        updated = updated.filter(
          (item) =>
            item.category &&
            item.category.toLowerCase().trim() ===
              filters.category.toLowerCase().trim()
        );
      }

      // Min Price
      if (filters.minPrice !== null && !isNaN(filters.minPrice)) {
        updated = updated.filter(
          (item) => item.price >= Number(filters.minPrice)
        );
      }

      // Max Price
      if (filters.maxPrice !== null && !isNaN(filters.maxPrice)) {
        updated = updated.filter(
          (item) => item.price <= Number(filters.maxPrice)
        );
      }

      // Rating
      if (filters.rating && filters.rating !== "all") {
        updated = updated.filter(
          (item) =>
            item.rating && Math.floor(item.rating) >= parseInt(filters.rating)
        );
      }

      // Sorting
      switch (filters.sortOption) {
        case "priceLowToHigh":
          updated.sort((a, b) => a.price - b.price);
          break;
        case "priceHighToLow":
          updated.sort((a, b) => b.price - a.price);
          break;
        case "nameAZ":
          updated.sort((a, b) => a.name.localeCompare(b.name));
          break;
        default:
          break;
      }
    }

    console.log("Filtered results count:", updated.length);
    setFilteredResults(updated);
  };

  const handleClearFilters = () => {
    applyFilters({
      category: "all",
      minPrice: null,
      maxPrice: null,
      rating: "all",
      sortOption: "",
    });
  };

  return (
    <div className="search-page">
      <NavBar />

      <div className="search-container">
        <div className="search-header-text">
          <h1>Search Lychee</h1>
          <p className="subtitle">Find {searchType} you’ll love 💄</p>
        </div>
        <SearchBar searchType={searchType} />
      </div>

      <div className="search-body">
        {searchType === "products" && (
          <FiltersPanel
            onApplyFilters={applyFilters}
            categories={productCategories}
          />
        )}

        <div className="search-results-section">
          {loading && <p className="loading-text">Searching...</p>}

          {!loading && !query && filteredResults.length === 0 && (
            <p className="info-message">
              Use the search bar above to find {searchType}
            </p>
          )}

          {!loading && query && filteredResults.length > 0 && (
            <>
              <div className="results-header">
                <div>
                  <h3>
                    Results for "<span className="highlight">{query}</span>"
                  </h3>
                  <p className="results-count">
                    {filteredResults.length} results found
                  </p>
                </div>
                {searchType === "products" && (
                  <button
                    className="clear-filters"
                    onClick={handleClearFilters}
                  >
                    Clear Filters
                  </button>
                )}
              </div>

              <div className="product-grid">
                {filteredResults.map((item) => (
                  <div key={item.id}>{renderCard(item)}</div>
                ))}
              </div>
            </>
          )}

          {!loading && query && filteredResults.length === 0 && (
            <div className="no-results">
              <p>
                No results found for "<strong>{query}</strong>" 😢
              </p>
              <p>Try different filters or search terms</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
