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
import { getReviews } from "../api/reviews";
import "../PagesCss/ProductListingPage.css";

const ProductListingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialQuery = searchParams.get("query") || "";
  const initialCategory = searchParams.get("category") || "All";

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [activeFilters, setActiveFilters] = useState({
    brand: "All",
    mainCategory: initialCategory,
    subCategory: "All",
    subSubCategory: "All",
    features: "",
    sortOption: "none",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productBrands, setProductBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productRatings, setProductRatings] = useState({});

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
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

  const calculateProductRating = async (productId) => {
    try {
      const reviews = await getReviews("product", productId);
      if (!reviews || reviews.length === 0) return 0;
      const total = reviews.reduce((sum, r) => sum + r.rating, 0);
      return total / reviews.length;
    } catch (error) {
      console.error(`Error getting rating for product ${productId}:`, error);
      return 0;
    }
  };

  const getProductRating = async (productId) => {
    if (productRatings[productId] !== undefined) {
      return productRatings[productId];
    }
    const rating = await calculateProductRating(productId);
    setProductRatings((prev) => ({ ...prev, [productId]: rating }));
    return rating;
  };

  const handleRetry = () => {
    fetchProducts();
    fetchCategories();
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    const newParams = {};
    if (term) newParams.query = term;
    if (activeFilters.mainCategory !== "All")
      newParams.category = activeFilters.mainCategory;
    setSearchParams(newParams);
    applyFiltersAndSearch(term, activeFilters);
  };

  const handleApplyFilters = (filters) => {
    setActiveFilters(filters);
    const newParams = {};
    if (searchTerm) newParams.query = searchTerm;
    if (filters.mainCategory !== "All")
      newParams.category = filters.mainCategory;
    setSearchParams(newParams);
    applyFiltersAndSearch(searchTerm, filters);
  };

  const findCategoryByName = (categoryName, level = null) => {
    const match = categories.find(
      (cat) =>
        cat.name?.toLowerCase() === categoryName.toLowerCase() &&
        (level === null || cat.level === level)
    );
    return match;
  };

  const getProductsForCategoryTree = async (categoryName, level) => {
    try {
      const category = findCategoryByName(categoryName, level);
      if (!category) return [];

      const directProducts = await getProductsByCategoryId(category.category_id);
      let allProductIds = new Set(directProducts.map((pc) => pc.product_id));

      const subcategories = categories.filter(
        (cat) => cat.parent_id === category.category_id
      );

      for (const subcat of subcategories) {
        const subcatProducts = await getProductsForCategoryTree(
          subcat.name,
          subcat.level
        );
        subcatProducts.forEach((id) => allProductIds.add(id));
      }

      return Array.from(allProductIds);
    } catch (error) {
      console.error(`Error getting products for ${categoryName}:`, error);
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
    let categoryFilteredIds = null;

    try {
      if (subSubCategory && subSubCategory !== "All") {
        categoryFilteredIds = await getProductsForCategoryTree(subSubCategory, 2);
      } else if (subCategory && subCategory !== "All") {
        categoryFilteredIds = await getProductsForCategoryTree(subCategory, 1);
      } else if (mainCategory && mainCategory !== "All") {
        categoryFilteredIds = await getProductsForCategoryTree(mainCategory, 0);
      }

      if (categoryFilteredIds !== null) {
        result = result.filter((p) => categoryFilteredIds.includes(p.product_id));
      }
    } catch (error) {
      console.error("Error filtering by category:", error);
    }

    if (brand && brand !== "All") {
      result = result.filter(
        (p) => p.brand?.toLowerCase() === brand.toLowerCase()
      );
    }

    if (features && features.trim()) {
      const query = features.toLowerCase();
      result = result.filter((p) => {
        const matchFeatures = p.features?.some((f) =>
          f.toLowerCase().includes(query)
        );
        const matchDesc = p.description?.toLowerCase().includes(query);
        return matchFeatures || matchDesc;
      });
    }

    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.brand?.toLowerCase().includes(query) ||
          p.features?.some((f) => f.toLowerCase().includes(query))
      );
    }

    switch (sortOption) {
      case "nameAZ":
        result.sort((a, b) => a.name?.localeCompare(b.name));
        break;
      case "nameZA":
        result.sort((a, b) => b.name?.localeCompare(a.name));
        break;
      case "highestRated": {
        const rated = await Promise.all(
          result.map(async (p) => ({
            product: p,
            rating: await getProductRating(p.product_id),
          }))
        );
        rated.sort((a, b) => b.rating - a.rating);
        result = rated.map((r) => r.product);
        break;
      }
      case "lowestRated": {
        const rated = await Promise.all(
          result.map(async (p) => ({
            product: p,
            rating: await getProductRating(p.product_id),
          }))
        );
        rated.sort((a, b) => a.rating - b.rating);
        result = rated.map((r) => r.product);
        break;
      }
      default:
        break;
    }

    setFilteredProducts(result);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setSearchParams({});
    const resetFilters = {
      brand: "All",
      mainCategory: "All",
      subCategory: "All",
      subSubCategory: "All",
      features: "",
      sortOption: "none",
    };
    setActiveFilters(resetFilters);
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
