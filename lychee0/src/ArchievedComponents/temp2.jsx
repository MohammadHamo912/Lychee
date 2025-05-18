import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../ComponentsCss/StorePage.css";
import {
  getStoreById,
  getStoreProducts,
  getStoreReviews,
  getStoreStats,
} from "../api/stores.js";
import { getItemsByStoreId } from "../api/items.js";
import ProductCard from "../components/ProductCard";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

// Mock data imports
import shop1SampleImage from "../images/shop1SampleImage.png";
import storeBanner from "../images/store-banner.jpg";

// Data to be fetched from the database/backend:
// - store.logo: Store logo image URL
// - store.banner: Store banner image URL
// - store.isVerified: Boolean indicating if the store is verified
// - store.rating: Store rating (e.g., 4.8)
// - store.reviewCount: Number of reviews for the store
// - store.foundedDate: Year the store was founded
// - store.location: Store location (e.g., "Paris, France")
// - store.socialLinks: Object containing social media links (e.g., { instagram, facebook })
// - products.isNew: Boolean indicating if a product is new (for sorting)
// - products.reviewCount: Number of reviews for each product (for sorting)

const StorePage = () => {
  // const { storeId } = useParams();
  const storeId = 2; // Mock store ID for example
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Mock categories for filtering
  const categories = ["Skincare", "Makeup", "Accessories", "Fragrances"];

  // Fetch store data
  useEffect(() => {
    fetchStoreData();
  }, [storeId]);

  const fetchStoreData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const storeData = await getStoreById(storeId);
      setStore(storeData);
      const productsData = await getItemsByStoreId(storeId);
      setProducts(productsData || []);
      // const reviewsData = await getStoreReviews(storeId);
      // setReviews(reviewsData || []);
      // const statsData = await getStoreStats(storeId);
      // setStats(statsData);
    } catch (err) {
      console.error("Error loading store data:", err);
      setError("Failed to load store information. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter products based on search and category
  const filteredProducts = products.filter((product) => {
    const matchesCategory = filter === "all" || product.category === filter;
    const matchesSearch =
      product.name && product.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sort products based on selection
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        // return a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1; // Requires isNew from backend
        return 0; // Placeholder until isNew is fetched
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "popular":
        // return b.reviewCount - a.reviewCount; // Requires reviewCount from backend
        return 0; // Placeholder until reviewCount is fetched
      default:
        return 0;
    }
  });

  // Handle add to cart function
  const handleAddToCart = (product) => {
    console.log(`Added ${product.name} to cart`);
    // In a real app, you would dispatch this to your cart state or context
  };

  // Product categories for filtering (dynamic based on available products)
  const productCategories = [
    "all",
    ...new Set(products.map((p) => p.category).filter(Boolean)),
  ];

  if (isLoading) {
    return (
      <div className="store-loading">
        <div className="loading-spinner"></div>
        <p>Loading store...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!store) {
    return <div className="not-found">Store not found</div>;
  }

  return (
    <div className="site-wrapper">
      <NavBar />
      <main className="site-content">
        <div className="store-page section">
          <div className="store-header">
            {/* Store banner image */}
            {/* <img
              src={storeBanner}
              alt={`${store.name} banner`}
              className="store-banner"
            /> */}
            <div className="store-info-container container">
              <div className="store-info">
                <div className="store-logo-container">
                  {/* <img
                    src={store.logo || shop1SampleImage}
                    alt={`${store.name} logo`}
                    className="store-logo"
                  /> */}
                </div>
                <div className="store-details">
                  <h1 className="store-name">
                    {store.name}
                    {/* {store.isVerified && (
                      <span className="verified-badge">
                        <span className="verified-icon">✓</span> Verified
                      </span>
                    )} */}
                  </h1>
                  <div className="store-meta">
                    <div className="store-meta-item">
                      <span className="meta-icon">★</span>
                      <div className="store-rating">
                        <span className="rating-value">
                          {/* {store.rating || "N/A"} */}
                        </span>
                        <span className="review-count">
                          {/* ({store.reviewCount || 0} reviews) */}
                        </span>
                      </div>
                    </div>
                    <div className="store-meta-item">
                      <span className="meta-icon">📍</span>
                      <div className="store-location">
                        {/* {store.location || "Unknown"} */}
                      </div>
                    </div>
                    <div className="store-meta-item">
                      <span className="meta-icon">🕒</span>
                      <div>{/* Since {store.foundedDate || "N/A"} */}</div>
                    </div>
                  </div>
                  <p className="store-description">
                    {store.description || "No description available"}
                  </p>
                  <div className="store-social">
                    {/* <a
                      href={store.socialLinks?.instagram}
                      className="social-link"
                    >
                      <span className="social-icon">📸</span> Instagram
                    </a>
                    <a
                      href={store.socialLinks?.facebook}
                      className="social-link"
                    >
                      <span className="social-icon">👥</span> Facebook
                    </a>
                    <a href="#contact" className="social-link">
                      <span className="social-icon">✉️</span> Contact
                    </a> */}
                  </div>
                </div>
              </div>
              <div className="store-quick-actions">
                <button
                  className="action-button favorite"
                  aria-label="Add to favorites"
                >
                  ❤️
                </button>
                <button
                  className="action-button share"
                  aria-label="Share store"
                >
                  🔗
                </button>
                <button
                  className="action-button"
                  aria-label="View store information"
                >
                  ℹ️
                </button>
              </div>
            </div>
          </div>
          <div className="store-content container">
            <div className="store-filters">
              <div className="category-filters">
                <h3>Categories</h3>
                <div className="filter-options">
                  {productCategories.map((category) => (
                    <button
                      key={category}
                      className={`filter-btn ${
                        filter === category ? "active" : ""
                      }`}
                      onClick={() => setFilter(category)}
                    >
                      {category === "all"
                        ? "All Products"
                        : `${
                            category.charAt(0).toUpperCase() + category.slice(1)
                          }`}
                    </button>
                  ))}
                </div>
              </div>
              <div className="sort-options">
                <label htmlFor="sort-select">Sort by:</label>
                <select
                  id="sort-select"
                  className="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Newest</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>
            <div className="products-section">
              <h2 className="products-heading">
                {filter === "all" ? "All Products" : filter}
                <span className="product-count">({sortedProducts.length})</span>
              </h2>
              {sortedProducts.length === 0 ? (
                <p className="no-products">
                  No products available in this store.
                </p>
              ) : (
                <div className="product-grid">
                  {sortedProducts.map((product) => (
                    <ProductCard
                      key={product.productId}
                      product={product}
                      onAddToCart={handleAddToCart}
                      onViewDetails={() => setViewingProduct(product)}
                    />
                  ))}
                </div>
              )}
            </div>
            {/* Store Statistics Section */}
            {stats && (
              <div className="store-stats-section">
                <h3>Store Statistics</h3>
                <div className="stats-grid">
                  {Object.entries(stats).map(([key, value]) => (
                    <div className="stat-item" key={key}>
                      <span className="stat-label">
                        {key
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase())}
                        :
                      </span>
                      <span className="stat-value">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Store Reviews Section */}
            <div className="store-reviews-section">
              <h3>Customer Reviews</h3>
              {reviews.length === 0 ? (
                <p className="no-reviews">
                  No reviews available for this store.
                </p>
              ) : (
                <div className="reviews-list">
                  {reviews.map((review) => (
                    <div className="review-item" key={review.reviewId}>
                      <div className="review-header">
                        <span className="review-author">
                          {review.customerName || "Anonymous"}
                        </span>
                        <span className="review-rating">
                          {Array(review.rating || 5)
                            .fill("★")
                            .join("")}
                        </span>
                        {review.createdAt && (
                          <span className="review-date">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <p className="review-content">
                        {review.content || "No review content"}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* Product Details Modal */}
          {viewingProduct && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h2>Product Details</h2>
                <p>
                  <strong>Name:</strong> {viewingProduct.name}
                </p>
                <p>
                  <strong>Price:</strong> $
                  {viewingProduct.price?.toFixed(2) || "N/A"}
                </p>
                <p>
                  <strong>Category:</strong>{" "}
                  {viewingProduct.category || "Uncategorized"}
                </p>
                <p>
                  <strong>Description:</strong>{" "}
                  {viewingProduct.description || "No description available"}
                </p>
                {viewingProduct.stock !== undefined && (
                  <p>
                    <strong>In Stock:</strong> {viewingProduct.stock}
                  </p>
                )}
                {viewingProduct.createdAt && (
                  <p>
                    <strong>Added:</strong>{" "}
                    {new Date(viewingProduct.createdAt).toLocaleDateString()}
                  </p>
                )}
                <button
                  className="close-button"
                  onClick={() => setViewingProduct(null)}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StorePage;
