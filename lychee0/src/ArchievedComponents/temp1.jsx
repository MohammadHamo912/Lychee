import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../ComponentsCss/StorePage.css";
import ProductCard from "../components/ProductCard";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
// Import API functions
import { getStoreById } from "../api/stores.js";
import { getItemsByStoreId } from "../api/items.js";

// Mock data imports for fallback/development
import shop1SampleImage from "../images/shop1SampleImage.png";
import storeBanner from "../images/store-banner.jpg";

/**
 * Data to fetch from backend/database:
 * 1. Store information:
 *    - id, name, logo, banner image, description
 *    - rating, reviewCount, foundedDate, location
 *    - socialLinks (instagram, facebook)
 *    - isVerified status
 *
 * 2. Store products:
 *    - Full product details including id, name, price, description
 *    - category, images, stock status, isNew flag
 *    - reviewCount for sorting by popularity
 *
 * 3. Store reviews data:
 *    - Review content, author details, ratings
 *    - Dates, helpful votes, etc.
 *
 * 4. Store statistics (optional):
 *    - Sales data, customer satisfaction metrics
 *    - Product performance stats
 */

const StorePage = () => {
  // Get storeId from URL params
  const { storeId } = useParams();
  // For testing/development without router
  // const storeId = 1;

  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [search, setSearch] = useState("");
  // For product detail modal
  const [viewingProduct, setViewingProduct] = useState(null);

  // Mock categories for filtering - replace with dynamic categories from products
  const categories = ["Skincare", "Makeup", "Accessories", "Fragrances"];

  // Fetch store data from API
  useEffect(() => {
    fetchStoreData();
  }, [storeId]);

  const fetchStoreData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch store details
      const storeData = await getStoreById(storeId);
      setStore(storeData);

      // Fetch products for this store
      const productsData = await getItemsByStoreId(storeId);
      setProducts(productsData || []);

      // TODO: Fetch reviews for this store
      // const reviewsData = await getStoreReviews(storeId);

      // TODO: Fetch store statistics
      // const statsData = await getStoreStats(storeId);
    } catch (err) {
      console.error("Error loading store data:", err);
      setError("Failed to load store information. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Filter products based on category selection and search term
  const filteredProducts = products.filter((product) => {
    const matchesCategory = filter === "all" || product.category === filter;
    const matchesSearch =
      !search ||
      (product.name &&
        product.name.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Sort products based on selection
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1;
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "popular":
        return b.reviewCount - a.reviewCount;
      default:
        return 0;
    }
  });

  // Handle add to cart function
  const handleAddToCart = (product) => {
    console.log(`Added ${product.name} to cart`);
    // In a real app, you would dispatch this to your cart state or context
  };

  return (
    <div className="site-wrapper">
      {/* NavBar component at the top */}
      <NavBar />

      {/* Main content area */}
      <main className="site-content">
        {loading ? (
          <div className="store-loading">
            <div className="loading-spinner"></div>
            <p>Loading store...</p>
          </div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : !store ? (
          <div className="not-found">Store not found</div>
        ) : (
          <div className="store-page section">
            <div className="store-header">
              {/* Store banner image */}
              <img
                src={store.banner || storeBanner}
                alt={`${store.name} banner`}
                className="store-banner"
              />

              <div className="store-info-container container">
                <div className="store-info">
                  <div className="store-logo-container">
                    <img
                      src={store.logo || shop1SampleImage}
                      alt={`${store.name} logo`}
                      className="store-logo"
                    />
                  </div>

                  <div className="store-details">
                    <h1 className="store-name">
                      {store.name}
                      {store.isVerified && (
                        <span className="verified-badge">
                          <span className="verified-icon">✓</span> Verified
                        </span>
                      )}
                    </h1>

                    <div className="store-meta">
                      <div className="store-meta-item">
                        <span className="meta-icon">★</span>
                        <div className="store-rating">
                          <span className="rating-value">
                            {store.rating || "N/A"}
                          </span>
                          <span className="review-count">
                            ({store.reviewCount || 0} reviews)
                          </span>
                        </div>
                      </div>

                      <div className="store-meta-item">
                        <span className="meta-icon">📍</span>
                        <div className="store-location">
                          {store.location || "Location unknown"}
                        </div>
                      </div>

                      <div className="store-meta-item">
                        <span className="meta-icon">🕒</span>
                        <div>Since {store.foundedDate || "N/A"}</div>
                      </div>
                    </div>

                    <p className="store-description">
                      {store.description || "No description available"}
                    </p>

                    <div className="store-social">
                      {store.socialLinks?.instagram && (
                        <a
                          href={store.socialLinks.instagram}
                          className="social-link"
                        >
                          <span className="social-icon">📸</span> Instagram
                        </a>
                      )}
                      {store.socialLinks?.facebook && (
                        <a
                          href={store.socialLinks.facebook}
                          className="social-link"
                        >
                          <span className="social-icon">👥</span> Facebook
                        </a>
                      )}
                      <a href="#contact" className="social-link">
                        <span className="social-icon">✉️</span> Contact
                      </a>
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
                    <button
                      className={`filter-btn ${
                        filter === "all" ? "active" : ""
                      }`}
                      onClick={() => setFilter("all")}
                    >
                      All Products
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category}
                        className={`filter-btn ${
                          filter === category ? "active" : ""
                        }`}
                        onClick={() => setFilter(category)}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="search-container">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="search-input"
                  />
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
                  <span className="product-count">
                    ({sortedProducts.length})
                  </span>
                </h2>

                {sortedProducts.length === 0 ? (
                  <p className="no-products">
                    No products available in this category.
                  </p>
                ) : (
                  <div className="product-grid">
                    {sortedProducts.map((product) => (
                      <ProductCard
                        key={product.id || product.productId}
                        product={product}
                        onAddToCart={handleAddToCart}
                        onViewDetails={() => setViewingProduct(product)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Store Reviews Section - Commented out until API is ready */}
            {/* 
            <div className="store-reviews-section container">
              <h3>Customer Reviews</h3>
              {reviews.length === 0 ? (
                <p className="no-reviews">No reviews available for this store.</p>
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
            */}
          </div>
        )}

        {/* Product Details Modal */}
        {viewingProduct && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>{viewingProduct.name}</h2>
              <div className="modal-product-details">
                {viewingProduct.image && (
                  <img
                    src={viewingProduct.image}
                    alt={viewingProduct.name}
                    className="modal-product-image"
                  />
                )}
                <div className="modal-product-info">
                  <p className="modal-product-price">
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
                  {viewingProduct.isNew && (
                    <p className="new-product-badge">New Arrival</p>
                  )}
                  <button
                    className="add-to-cart-btn"
                    onClick={() => {
                      handleAddToCart(viewingProduct);
                      setViewingProduct(null);
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
              <button
                className="close-button"
                onClick={() => setViewingProduct(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer component at the bottom */}
      <Footer />
    </div>
  );
};

export default StorePage;
