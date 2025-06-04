import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import SearchBar from "../components/SearchBar";
import ProductFiltersPanel from "../components/ProductFiltersPanel";
import Footer from "../components/Footer";
import ProductGrid from "../components/ProductGrid";
import { getAllProducts } from "../api/products";
import "../PagesCss/ProductListingPage.css";

const ProductListingPage = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("query") || "";

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [activeFilters, setActiveFilters] = useState({
    brand: "All",
    category: "All",
    features: "", // Change to empty string for text input
    sortOption: "none",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productBrands, setProductBrands] = useState([]);
  const [productCategories, setProductCategories] = useState([]);

  // Fetch products and extract brands and categories
  useEffect(() => {
    fetchProducts();
  }, []);

  // Apply filters when products data or initial query changes
  useEffect(() => {
    if (products.length > 0) {
      // Extract unique brands and categories
      const brands = [
        ...new Set(products.map((p) => p.brand).filter(Boolean)),
      ].sort();
      const categories = [
        ...new Set(products.map((p) => p.category).filter(Boolean)),
      ].sort();
      setProductBrands(brands);
      setProductCategories(categories);
      applyFiltersAndSearch(initialQuery, activeFilters);
    }
  }, [initialQuery, products]);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    fetchProducts();
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
    const { brand, category, features, sortOption } = filters;

    let result = [...products];

    // Brand filtering
    if (brand && brand !== "All") {
      result = result.filter(
        (product) => product.brand?.toLowerCase() === brand.toLowerCase()
      );
    }

    // Category filtering
    if (category && category !== "All") {
      result = result.filter(
        (product) => product.category?.toLowerCase() === category.toLowerCase()
      );
    }

    // Features filtering (text-based partial match)
    if (features && features.trim()) {
      const lowerFeatures = features.toLowerCase();
      result = result.filter((product) => {
        const featuresMatch = product.features?.some((feature) =>
          feature.toLowerCase().includes(lowerFeatures)
        );
        const descriptionMatch = product.description
          ?.toLowerCase()
          .includes(lowerFeatures);
        return featuresMatch || descriptionMatch;
      });
    }

    // Search filtering
    if (search.trim()) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(
        (product) =>
          product.name?.toLowerCase().includes(lowerSearch) ||
          product.description?.toLowerCase().includes(lowerSearch) ||
          product.brand?.toLowerCase().includes(lowerSearch) ||
          product.category?.toLowerCase().includes(lowerSearch) ||
          product.features?.some((feature) =>
            feature.toLowerCase().includes(lowerSearch)
          )
      );
    }

    // Sorting
    switch (sortOption) {
      case "nameAZ":
        result.sort((a, b) =>
          a.name?.toLowerCase().localeCompare(b.name?.toLowerCase())
        );
        break;
      case "nameZA":
        result.sort((a, b) =>
          b.name?.toLowerCase().localeCompare(a.name?.toLowerCase())
        );
        break;
      case "priceLowHigh":
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "priceHighLow":
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
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

    setFilteredProducts(result);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    applyFiltersAndSearch("", activeFilters);
  };

  return (
    <div className="products-page">
      <NavBar />

      <div className="products-hero">
        <div className="products-hero-content">
          <h1>Discover Beauty Products</h1>
          <p>
            Find your perfect beauty products from top brands and discover new
            favorites
          </p>
          <div className="search-container">
            <SearchBar searchType="products" onSearch={handleSearch} />
          </div>
        </div>
      </div>

      <div className="products-content">
        <div className="products-sidebar">
          <h2>Filter Products</h2>
          <ProductFiltersPanel
            onApplyFilters={handleApplyFilters}
            brands={productBrands}
            categories={productCategories}
            // No features prop needed anymore
          />
        </div>

        <div className="products-main">
          <div className="products-results-header">
            <h2>
              All Products{" "}
              {filteredProducts.length > 0 && `(${filteredProducts.length})`}
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
              <h3>Error Loading Products</h3>
              <p>{error}</p>
              <button onClick={handleRetry} className="retry-btn">
                Try Again
              </button>
            </div>
          ) : isLoading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading products...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <ProductGrid
              products={filteredProducts}
              title=""
              header=""
              className="all-products-page"
              isLoading={false}
              error={null}
            />
          ) : (
            <div className="no-results">
              <h3>No products found</h3>
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

export default ProductListingPage;
