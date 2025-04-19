import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "../PagesCss/ProductPage.css";
import productImg from "../images/mascara.png"; // Default image
import dummyProducts from "../Data/dummyProducts";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const ProductPage = () => {
  const { id } = useParams();
  const product = dummyProducts.find((p) => p.id === parseInt(id));

  // Product interaction states
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  // Update document title
  useEffect(() => {
    document.title = product
      ? `${product.name} | Lychee`
      : "Product Not Found | Lychee";
  }, [product]);

  const handleQuantityChange = (delta) => {
    const newQuantity = Math.max(1, quantity + delta);
    setQuantity(newQuantity);
  };

  const showTemporaryNotification = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleAddToCart = () => {
    console.log("Added to cart:", { ...product, quantity });
    showTemporaryNotification(
      `${quantity} ${product?.name || "Product"} added to your cart`
    );
  };

  const handleBuyNow = () => {
    console.log("Finding best price for:", product);
    showTemporaryNotification(
      `Finding best price for ${product?.name || "Product"}`
    );
  };

  const toggleWishlist = () => {
    const newWishlistState = !isWishlisted;
    setIsWishlisted(newWishlistState);
    console.log(
      `Wishlist ${newWishlistState ? "added" : "removed"} for ID: ${id}`
    );
    showTemporaryNotification(
      isWishlisted
        ? `${product?.name || "Product"} removed from wishlist`
        : `${product?.name || "Product"} added to wishlist`
    );
  };

  // Default product data if none provided
  const defaultProduct = {
    name: "Glossy Lip Shine",
    brand: "Lychee Beauty",
    price: 19.99,
    salePrice: 16.99,
    description:
      "A luxurious lip gloss that adds a radiant shine and subtle color to your lips, crafted with natural ingredients.",
    features: [
      "Long-lasting formula for up to 8 hours of wear",
      "Made with 95% natural ingredients",
      "Hydrating formula with botanical oils",
      "Non-sticky texture for comfortable wear",
      "Cruelty-free and vegan",
    ],
    howToUse:
      "Apply to clean, dry lips. For a more intense effect, apply two coats, allowing the first coat to dry before applying the second.",
    ingredients:
      "Ricinus Communis (Castor) Seed Oil, Octyldodecanol, Silica, Hydrogenated Polyisobutene, Ethylhexyl Palmitate, Mica, Parfum (Fragrance), Tocopheryl Acetate, Helianthus Annuus (Sunflower) Seed Oil, Calendula Officinalis Flower Extract",
    reviews: [
      {
        id: 1,
        user: "Sophia L.",
        rating: 5,
        date: "March 15, 2025",
        text: "Loved the texture and shine! This has become my everyday go-to lip product.",
      },
      {
        id: 2,
        user: "Amelia T.",
        rating: 4,
        date: "March 2, 2025",
        text: "Perfect for everyday wear. I wish it lasted just a bit longer, but the color payoff is amazing.",
      },
    ],
    rating: 4.5,
    shades: ["Rose Petal", "Sunset Glow", "Berry Bliss", "Clear Shine"],
    inStock: true,
  };

  const finalProduct = product || defaultProduct;

  const renderRatingStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="stars-container">
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`} className="star full-star">
            ★
          </span>
        ))}
        {hasHalfStar && <span className="star half-star">★</span>}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} className="star empty-star">
            ☆
          </span>
        ))}
      </div>
    );
  };

  // Helper function to generate colors for shade options
  const getShadeColor = (shadeName) => {
    const colorMap = {
      "Rose Petal": "#f5a0a0",
      "Sunset Glow": "#ff9966",
      "Berry Bliss": "#aa5080",
      "Clear Shine": "#f0f0f0",
      // Add more shade colors as needed
    };

    return colorMap[shadeName] || "#b76e79";
  };

  if (!product && id) {
    return (
      <div className="product-page">
        <NavBar />
        <main className="main-content">
          <div className="not-found">
            <h2>Product Not Found</h2>
            <p>
              We couldn't find a product with ID {id}. It might have been
              removed or doesn't exist.
            </p>
            <Link to="/shop" className="back-to-shop">
              Back to Shop
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="product-page">
      <NavBar />

      <main className="main-content">
        <div className="product-details-container">
          {showNotification && (
            <div className="notification">
              <span>{notificationMessage}</span>
            </div>
          )}

          {/* Left Side - Image Gallery */}
          <div className="product-gallery">
            <div className="main-image-wrapper">
              <img
                src={productImg}
                alt={finalProduct.name}
                className="product-image"
              />
              {finalProduct.salePrice && <div className="sale-badge">SALE</div>}
              <button
                className={`wishlist-btn ${isWishlisted ? "wishlisted" : ""}`}
                onClick={toggleWishlist}
                aria-label={
                  isWishlisted ? "Remove from wishlist" : "Add to wishlist"
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill={isWishlisted ? "#b76e79" : "none"}
                  stroke={isWishlisted ? "#b76e79" : "#670010"}
                  strokeWidth="2"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </button>
            </div>

            <div className="image-thumbnails">
              {/* This would normally map through product images */}
              {[1, 2, 3].map((i) => (
                <div key={i} className="thumbnail-wrapper">
                  <img
                    src={productImg}
                    alt={`${finalProduct.name} view ${i}`}
                    className="thumbnail-image"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Product Details */}
          <div className="product-info-block">
            <div className="product-header">
              <div className="brand-badge">{finalProduct.brand}</div>
              <h1 className="product-title">{finalProduct.name}</h1>

              <div className="product-rating">
                {renderRatingStars(finalProduct.rating)}
                <span className="rating-count">
                  ({finalProduct.reviews.length} reviews)
                </span>
              </div>

              <div className="product-price-container">
                {finalProduct.salePrice ? (
                  <>
                    <span className="original-price">
                      ${finalProduct.price.toFixed(2)}
                    </span>
                    <span className="sale-price">
                      ${finalProduct.salePrice.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="product-price">
                    ${finalProduct.price.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {finalProduct.shades && finalProduct.shades.length > 0 && (
              <div className="product-variants">
                <h3 className="variants-title">Shades</h3>
                <div className="shade-options">
                  {finalProduct.shades.map((shade, idx) => (
                    <button key={idx} className="shade-option" title={shade}>
                      <span
                        className="shade-circle"
                        style={{ backgroundColor: getShadeColor(shade) }}
                      ></span>
                      <span className="shade-name">{shade}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="product-actions">
              <div className="stock-status">
                <span
                  className={`status-indicator ${
                    finalProduct.inStock ? "in-stock" : "out-of-stock"
                  }`}
                ></span>
                <span className="status-text">
                  {finalProduct.inStock ? "In Stock" : "Out of Stock"}
                </span>
              </div>

              <div className="quantity-control">
                <button
                  className="quantity-btn"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="quantity-input"
                />
                <button
                  className="quantity-btn"
                  onClick={() => handleQuantityChange(1)}
                >
                  +
                </button>
              </div>

              <div className="button-group">
                <button
                  className="add-to-cart-btn"
                  onClick={handleAddToCart}
                  disabled={!finalProduct.inStock}
                >
                  Add to Cart
                </button>
                <button
                  className="buy-now-btn"
                  onClick={handleBuyNow}
                  disabled={!finalProduct.inStock}
                >
                  Find Best Price
                </button>
              </div>
            </div>

            <div className="product-meta">
              <div className="shipping-info">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="1" y="3" width="15" height="13"></rect>
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                  <circle cx="5.5" cy="18.5" r="2.5"></circle>
                  <circle cx="18.5" cy="18.5" r="2.5"></circle>
                </svg>
                <span>Free shipping on orders over $35</span>
              </div>
              <div className="returns-info">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 2v6h6"></path>
                  <path d="M3 13a9 9 0 1 0 3-7.7L3 8"></path>
                </svg>
                <span>30-day hassle-free returns</span>
              </div>
            </div>

            <div className="product-tabs">
              <div className="tabs-header">
                <button
                  className={`tab-button ${
                    activeTab === "description" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("description")}
                >
                  Description
                </button>
                <button
                  className={`tab-button ${
                    activeTab === "howToUse" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("howToUse")}
                >
                  How to Use
                </button>
                <button
                  className={`tab-button ${
                    activeTab === "ingredients" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("ingredients")}
                >
                  Ingredients
                </button>
                <button
                  className={`tab-button ${
                    activeTab === "reviews" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("reviews")}
                >
                  Reviews ({finalProduct.reviews.length})
                </button>
              </div>

              <div className="tab-content">
                {activeTab === "description" && (
                  <div className="description-tab">
                    <p>{finalProduct.description}</p>
                    {finalProduct.features && (
                      <div className="features-list">
                        <h4>Features</h4>
                        <ul>
                          {finalProduct.features.map((feature, idx) => (
                            <li key={idx}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "howToUse" && (
                  <div className="how-to-use-tab">
                    <h4>Application</h4>
                    <p>{finalProduct.howToUse}</p>
                  </div>
                )}

                {activeTab === "ingredients" && (
                  <div className="ingredients-tab">
                    <h4>Full Ingredients List</h4>
                    <p>{finalProduct.ingredients}</p>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="reviews-tab">
                    <div className="reviews-summary">
                      <div className="average-rating">
                        <span className="big-rating">
                          {finalProduct.rating.toFixed(1)}
                        </span>
                        <div className="rating-stars-large">
                          {renderRatingStars(finalProduct.rating)}
                        </div>
                        <span className="total-reviews">
                          Based on {finalProduct.reviews.length} reviews
                        </span>
                      </div>
                    </div>

                    <div className="reviews-list">
                      {finalProduct.reviews &&
                      finalProduct.reviews.length > 0 ? (
                        finalProduct.reviews.map((review) => (
                          <div key={review.id} className="review-item">
                            <div className="review-header">
                              <div className="reviewer-info">
                                <strong className="reviewer-name">
                                  {review.user}
                                </strong>
                                <span className="review-date">
                                  {review.date}
                                </span>
                              </div>
                              <div className="reviewer-rating">
                                {renderRatingStars(review.rating)}
                              </div>
                            </div>
                            <p className="review-text">{review.text}</p>
                          </div>
                        ))
                      ) : (
                        <p className="no-reviews">
                          No reviews yet. Be the first to share your thoughts!
                        </p>
                      )}
                    </div>

                    <button className="write-review-btn">Write a Review</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductPage;
