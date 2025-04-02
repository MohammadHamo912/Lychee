import React, { useState, useEffect } from "react";
import "../ComponentsCss/StorePage.css";
import ProductCard from "../components/ProductCard";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import dummyProducts from "../Data/dummyProducts";

// Mock data imports
import shop1SampleImage from "../images/shop1SampleImage.png";
import storeBanner from "../images/store-banner.jpg";
const StorePage = ({ match }) => {
  // In a real app, you'd fetch store id from URL params
  // const storeId = match.params.id;
  const storeId = 1; // Mock store ID for example

  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Mock categories for filtering
  const categories = ["Skincare", "Makeup", "Accessories", "Fragrances"];

  // Fetch store data (mock data for example)
  useEffect(() => {
    // Simulate API fetch with setTimeout
    setTimeout(() => {
      const storeData = {
        id: 1,
        name: "Elegance Boutique",
        logo: shop1SampleImage,
        banner: "../images/store-banner.jpg",
        description:
          "Curated collection of elegant and timeless pieces for the modern woman. We handpick each item to ensure quality and style.",
        rating: 4.8,
        reviewCount: 127,
        foundedDate: "2020",
        location: "Paris, France",
        socialLinks: {
          instagram: "https://instagram.com/elegance",
          facebook: "https://facebook.com/elegance",
        },
      };

      setStore(storeData);
      setProducts(dummyProducts);
      setLoading(false);
    }, 800); // Simulate loading delay
  }, [storeId]);

  // Filter products based on category selection
  const filteredProducts = products.filter((product) => {
    if (filter === "all") return true;
    return product.category === filter;
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
        ) : (
          <div className="store-page section">
            <div className="store-header">
              {/* Optional store banner image */}
              <img
                src={storeBanner}
                alt={`${store.name} banner`}
                className="store-banner"
              />

              <div className="store-info-container container">
                <div className="store-info">
                  <div className="store-logo-container">
                    <img
                      src={store.logo}
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
                          <span className="rating-value">{store.rating}</span>
                          <span className="review-count">
                            ({store.reviewCount} reviews)
                          </span>
                        </div>
                      </div>

                      <div className="store-meta-item">
                        <span className="meta-icon">📍</span>
                        <div className="store-location">{store.location}</div>
                      </div>

                      <div className="store-meta-item">
                        <span className="meta-icon">🕒</span>
                        <div>Since {store.foundedDate}</div>
                      </div>
                    </div>

                    <p className="store-description">{store.description}</p>

                    <div className="store-social">
                      <a
                        href={store.socialLinks.instagram}
                        className="social-link"
                      >
                        <span className="social-icon">📸</span> Instagram
                      </a>
                      <a
                        href={store.socialLinks.facebook}
                        className="social-link"
                      >
                        <span className="social-icon">👥</span> Facebook
                      </a>
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

                <div className="product-grid">
                  {sortedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              </div>
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
