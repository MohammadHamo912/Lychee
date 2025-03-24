import React, { useState, useEffect } from "react";
import "../ComponentsCss/StorePage.css";

// Mock data - In a real app this would come from an API
import shop1SampleImage from "../images/shop1SampleImage.png";
import product1Image from "../images/mascara.png";
import product2Image from "../images/lipgloss.jpeg";
import product3Image from "../images/placeholder-fragrances.jpg";
import product4Image from "../images/placeholder-haircare.jpg";
import product5Image from "../images/placeholder-skincare.png";
import product6Image from "../images/heroSectionBackground.jpg";

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

      const productData = [
        {
          id: 1,
          name: "Rose Gold Serum",
          price: 89.99,
          originalPrice: 110.0,
          category: "Skincare",
          image: product1Image,
          rating: 4.9,
          reviewCount: 42,
          isNew: true,
          isBestseller: true,
        },
        {
          id: 2,
          name: "Berry Hydration Mask",
          price: 49.99,
          originalPrice: 49.99,
          category: "Skincare",
          image: product2Image,
          rating: 4.7,
          reviewCount: 38,
          isNew: false,
          isBestseller: true,
        },
        {
          id: 3,
          name: "Cream Silk Scarf",
          price: 125.0,
          originalPrice: 150.0,
          category: "Accessories",
          image: product3Image,
          rating: 4.8,
          reviewCount: 27,
          isNew: false,
          isBestseller: false,
        },
        {
          id: 4,
          name: "Velvet Lipstick",
          price: 35.0,
          originalPrice: 35.0,
          category: "Makeup",
          image: product4Image,
          rating: 4.6,
          reviewCount: 54,
          isNew: true,
          isBestseller: false,
        },
        {
          id: 5,
          name: "Elderberry Perfume",
          price: 79.0,
          originalPrice: 95.0,
          category: "Fragrances",
          image: product5Image,
          rating: 4.9,
          reviewCount: 31,
          isNew: false,
          isBestseller: false,
        },
        {
          id: 6,
          name: "Pearl Earrings",
          price: 69.99,
          originalPrice: 89.99,
          category: "Accessories",
          image: product6Image,
          rating: 5.0,
          reviewCount: 19,
          isNew: true,
          isBestseller: true,
        },
      ];

      setStore(storeData);
      setProducts(productData);
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

  if (loading) {
    return (
      <div className="store-loading">
        <div className="loading-spinner"></div>
        <p>Loading store...</p>
      </div>
    );
  }

  return (
    <div className="store-page section">
      <div className="store-header">
        <div className="container">
          <div className="store-info">
            <div className="store-logo-container">
              <img
                src={store.logo}
                alt={`${store.name} logo`}
                className="store-logo"
              />
            </div>
            <div className="store-details">
              <h1 className="store-name">{store.name}</h1>
              <div className="store-meta">
                <div className="store-rating">
                  <span className="rating-stars">★★★★★</span>
                  <span className="rating-value">{store.rating}</span>
                  <span className="review-count">
                    ({store.reviewCount} reviews)
                  </span>
                </div>
                <div className="store-location">
                  <i className="location-icon">📍</i> {store.location}
                </div>
              </div>
              <p className="store-description">{store.description}</p>
              <div className="store-social">
                <a href={store.socialLinks.instagram} className="social-link">
                  Instagram
                </a>
                <a href={store.socialLinks.facebook} className="social-link">
                  Facebook
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="store-content container">
        <div className="store-filters">
          <div className="category-filters">
            <h3>Categories</h3>
            <div className="filter-options">
              <button
                className={`filter-btn ${filter === "all" ? "active" : ""}`}
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
            <span className="product-count">({sortedProducts.length})</span>
          </h2>

          <div className="product-grid">
            {sortedProducts.map((product) => (
              <div key={product.id} className="product-card card">
                <div className="product-image-container">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-image image"
                  />
                  {product.originalPrice > product.price && (
                    <span className="product-sale-badge">Sale</span>
                  )}
                  {product.isNew && (
                    <span className="product-new-badge">New</span>
                  )}
                  {product.isBestseller && (
                    <span className="product-bestseller-badge">Bestseller</span>
                  )}
                </div>
                <div className="product-content">
                  <h3 className="product-title">{product.name}</h3>
                  <div className="product-category">{product.category}</div>
                  <div className="product-rating">
                    <span className="rating-stars">★★★★★</span>
                    <span className="rating-value">{product.rating}</span>
                    <span className="review-count">
                      ({product.reviewCount})
                    </span>
                  </div>
                  <div className="product-price-container">
                    <span className="product-price">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="product-original-price">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <button className="btn btn-primary product-add-btn">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorePage;
