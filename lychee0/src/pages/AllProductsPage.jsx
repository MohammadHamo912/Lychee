import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import SearchBar from "../components/SearchBar";
import ProductFiltersPanel from "../components/ProductFiltersPanel";
import Footer from "../components/Footer";
import ProductGrid from "../components/ProductGrid";
import { getAllProducts } from "../api/products";
import { getAllCategories } from "../api/categories";
import { getProductsByCategoryId } from "../api/productcategories";
import "../PagesCss/ProductListingPage.css";

const ProductListingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialQuery = searchParams.get("query") || "";
  const initialCategory = searchParams.get("category") || "All"; // Get category from URL

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [activeFilters, setActiveFilters] = useState({
    brand: "All",
    mainCategory: initialCategory, // Set initial category from URL
    subCategory: "All",
    subSubCategory: "All",
    features: "",
    sortOption: "none",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productBrands, setProductBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  // Fetch products and categories
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Apply filters when products data, initial query, or initial category changes
  useEffect(() => {
    if (products.length > 0) {
      // Extract unique brands
      const brands = [
        ...new Set(products.map((p) => p.brand).filter(Boolean)),
      ].sort();
      setProductBrands(brands);
      applyFiltersAndSearch(initialQuery, activeFilters);
    }
  }, [initialQuery, initialCategory, products]);

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

  const fetchCategories = async () => {
    try {
      const categoriesData = await getAllCategories();
      setCategories(categoriesData);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const handleRetry = () => {
    fetchProducts();
    fetchCategories();
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    // Update URL parameters - preserve category if it exists
    const newParams = {};
    if (term) newParams.query = term;
    if (activeFilters.mainCategory !== "All")
      newParams.category = activeFilters.mainCategory;
    setSearchParams(newParams);
    applyFiltersAndSearch(term, activeFilters);
  };

  const handleApplyFilters = (filters) => {
    setActiveFilters(filters);
    // Update URL to reflect category changes
    const newParams = {};
    if (searchTerm) newParams.query = searchTerm;
    if (filters.mainCategory !== "All")
      newParams.category = filters.mainCategory;
    setSearchParams(newParams);
    applyFiltersAndSearch(searchTerm, filters);
  };

  // Helper function to find category by name
  const findCategoryByName = (categoryName, level = null) => {
    return categories.find(
      (cat) =>
        cat.name === categoryName && (level === null || cat.level === level)
    );
  };

  // Get products that belong to a specific category (including all subcategory products)
  const getProductsForCategoryTree = async (categoryName, level) => {
    try {
      const category = findCategoryByName(categoryName, level);
      if (!category) return [];

      // Get direct products for this category
      const directProducts = await getProductsByCategoryId(category.categoryId);
      let allProductIds = new Set(directProducts.map((pc) => pc.productId));

      // If this is not a leaf category, also get products from all subcategories
      const subcategories = categories.filter(
        (cat) => cat.parentId === category.categoryId
      );

      for (const subcat of subcategories) {
        const subcatProducts = await getProductsForCategoryTree(
          subcat.name,
          subcat.level
        );
        subcatProducts.forEach((productId) => allProductIds.add(productId));
      }

      return Array.from(allProductIds);
    } catch (error) {
      console.error(
        `Error getting products for category ${categoryName}:`,
        error
      );
      return [];
    }
  };

  const applyFiltersAndSearch = async (search = "", filters = {}) => {
    const {
      brand,
      mainCategory,
      subCategory,
      subSubCategory,
      features,
      sortOption,
    } = filters;

    let result = [...products];
    let categoryFilteredProductIds = null;

    // Category filtering - find the most specific category selected
    try {
      if (subSubCategory && subSubCategory !== "All") {
        // Most specific - filter by sub-sub category (level 2)
        categoryFilteredProductIds = await getProductsForCategoryTree(
          subSubCategory,
          2
        );
      } else if (subCategory && subCategory !== "All") {
        // Medium specific - filter by sub category (level 1)
        categoryFilteredProductIds = await getProductsForCategoryTree(
          subCategory,
          1
        );
      } else if (mainCategory && mainCategory !== "All") {
        // Least specific - filter by main category (level 0)
        categoryFilteredProductIds = await getProductsForCategoryTree(
          mainCategory,
          0
        );
      }

      // Apply category filter if any category was selected
      if (categoryFilteredProductIds !== null) {
        result = result.filter((product) =>
          categoryFilteredProductIds.includes(product.productId)
        );
      }
    } catch (error) {
      console.error("Error applying category filters:", error);
    }

    // Brand filtering
    if (brand && brand !== "All") {
      result = result.filter(
        (product) => product.brand?.toLowerCase() === brand.toLowerCase()
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
    setSearchParams({}); // Clear URL parameters

    // Reset all filters to default
    const resetFilters = {
      brand: "All",
      mainCategory: "All",
      subCategory: "All",
      subSubCategory: "All",
      features: "",
      sortOption: "none",
    };
    setActiveFilters(resetFilters);

    // Apply filters with empty search
    applyFiltersAndSearch("", resetFilters);
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
            <SearchBar
              searchType="products"
              onSearch={handleSearch}
              initialValue={searchTerm}
            />
          </div>
        </div>
      </div>

      <div className="products-content">
        <div className="products-sidebar">
          <h2>Filter Products</h2>
          <ProductFiltersPanel
            onApplyFilters={handleApplyFilters}
            brands={productBrands}
            activeFilters={activeFilters}
          />
        </div>

        <div className="products-main">
          <div className="products-results-header">
            <h2>
              {activeFilters.mainCategory !== "All"
                ? `${activeFilters.mainCategory} Products`
                : "All Products"}{" "}
              {filteredProducts.length > 0 && `(${filteredProducts.length})`}
            </h2>
            {(searchTerm || activeFilters.mainCategory !== "All") && (
              <div className="search-results-info">
                {searchTerm && (
                  <>
                    Showing results for: <span>"{searchTerm}"</span>
                  </>
                )}
                {activeFilters.mainCategory !== "All" && (
                  <>
                    {searchTerm && " in "}
                    {!searchTerm && "Showing: "}
                    <span>{activeFilters.mainCategory}</span>
                  </>
                )}
                <button onClick={handleClearSearch}>Clear All</button>
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
