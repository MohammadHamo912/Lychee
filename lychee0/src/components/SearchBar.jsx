import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import NavBar from "../components/NavBar";
import SearchBar from "../components/SearchBar";
import FilterPanel from "../components/FiltersPanel";
import ProductCard from "../components/ProductCard";
import dummyProducts from "../Data/dummyProducts";
import "../PagesCss/Search.css";

const SearchPage = () => {
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("query");
    if (q) {
      setQuery(q);
      const filtered = dummyProducts.filter((item) =>
        item.name.toLowerCase().includes(q.toLowerCase())
      );
      setProducts(filtered);
      setFilteredProducts(filtered);
    }
  }, [location.search]);

  const applyFilters = (filters) => {
    let result = [...products];

    if (filters.category !== "all") {
      result = result.filter((p) => p.category === filters.category);
    }

    if (filters.minPrice) {
      result = result.filter((p) => p.price >= parseFloat(filters.minPrice));
    }

    if (filters.maxPrice) {
      result = result.filter((p) => p.price <= parseFloat(filters.maxPrice));
    }

    switch (filters.sortOption) {
      case "priceLowToHigh":
        result.sort((a, b) => a.price - b.price);
        break;
      case "priceHighToLow":
        result.sort((a, b) => b.price - a.price);
        break;
      case "nameAZ":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    setFilteredProducts(result);
  };

  return (
    <div className="search-page">
      <NavBar />
      <div className="search-container">
        <div className="search-header-text">
          <h1>Search Lychee</h1>
          <p className="subtitle">Explore beauty, skincare & more</p>
        </div>
        <SearchBar disableActive />
      </div>

      <div className="search-body">
        <FilterPanel onApplyFilters={applyFilters} />

        <div className="search-results-section">
          <div className="results-header">
            <h3>
              Results for: <span className="highlight">{query}</span>
            </h3>
            <p className="results-count">{filteredProducts.length} results</p>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={() => console.log("Add:", product)}
                />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <p>No results found. Try a different keyword or adjust your filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
