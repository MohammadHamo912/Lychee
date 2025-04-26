import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "../PagesCss/ItemPage.css"; // You can rename this later to ItemPage.css if you want
import productImg from "../images/mascara.png";
import dummyItems from "../Data/dummyItems";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const ItemPage = () => {
  const { id } = useParams();
  const product = dummyItems.find((item) => item.id === parseInt(id));

  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  const defaultProduct = {
    name: "Glossy Lip Shine",
    brand: "Lychee Beauty",
    shop_name: "Lychee Official Store",
    price: 19.99,
    salePrice: 16.99,
    description: "A luxurious lip gloss that adds radiant shine and subtle color to your lips.",
    features: [
      "Long-lasting up to 8 hours",
      "95% natural ingredients",
      "Botanical oils for hydration",
      "Non-sticky texture",
      "Cruelty-free & vegan"
    ],
    howToUse: "Apply to clean, dry lips. For stronger color, apply two coats.",
    ingredients: "Castor Oil, Octyldodecanol, Silica, Hydrogenated Polyisobutene, Mica, Fragrance, Vitamin E",
    reviews: [
      { id: 1, user: "Sophia L.", rating: 5, date: "March 15, 2025", text: "Loved the shine! It’s my daily go-to." },
      { id: 2, user: "Amelia T.", rating: 4, date: "March 2, 2025", text: "Great color payoff, could last longer." },
    ],
    rating: 4.5,
    shades: ["Rose Petal", "Sunset Glow", "Berry Bliss", "Clear Shine"],
    inStock: true,
  };

  const finalProduct = product || defaultProduct;

  useEffect(() => {
    document.title = finalProduct.name ? `${finalProduct.name} | Lychee` : "Item Not Found | Lychee";
  }, [finalProduct.name]);

  const handleQuantityChange = (delta) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };

  const handleInputQuantity = (e) => {
    const value = Math.max(1, parseInt(e.target.value) || 1);
    setQuantity(value);
  };

  const showTemporaryNotification = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2500);
  };

  const handleAddToCart = () => {
    console.log("Added to cart:", { ...finalProduct, quantity });
    showTemporaryNotification(`${quantity} x ${finalProduct.name} added to your cart`);
  };

  const toggleWishlist = () => {
    setIsWishlisted(prev => !prev);
    showTemporaryNotification(
      !isWishlisted
        ? `${finalProduct.name} added to wishlist`
        : `${finalProduct.name} removed from wishlist`
    );
  };

  const getShadeColor = (shadeName) => {
    const shades = {
      "Rose Petal": "#f5a0a0",
      "Sunset Glow": "#ff9966",
      "Berry Bliss": "#aa5080",
      "Clear Shine": "#f0f0f0",
    };
    return shades[shadeName] || "#b76e79";
  };

  const renderRatingStars = (rating) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);
    return (
      <div className="stars-container">
        {[...Array(full)].map((_, i) => <span key={`full-${i}`} className="star">★</span>)}
        {half && <span className="star half-star">★</span>}
        {[...Array(empty)].map((_, i) => <span key={`empty-${i}`} className="star empty-star">☆</span>)}
      </div>
    );
  };

  if (!product && id) {
    return (
      <div className="product-page">
        <NavBar />
        <main className="main-content">
          <div className="not-found">
            <h2>Item Not Found</h2>
            <p>Item ID {id} does not exist or has been removed.</p>
            <Link to="/shop" className="back-to-shop">Back to Shop</Link>
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
              {notificationMessage}
            </div>
          )}

          {/* Image Gallery */}
          <div className="product-gallery">
            <div className="main-image-wrapper">
              <img src={productImg} alt={finalProduct.name} className="product-image" />
              {finalProduct.salePrice && <div className="sale-badge">SALE</div>}
              <button className={`wishlist-btn ${isWishlisted ? "wishlisted" : ""}`} onClick={toggleWishlist}>
                ❤️
              </button>
            </div>

            <div className="image-thumbnails">
              {[1, 2, 3].map((i) => (
                <div key={i} className="thumbnail-wrapper">
                  <img src={productImg} alt={`${finalProduct.name} view ${i}`} className="thumbnail-image" />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="product-info-block">
            <div className="product-header">
              <div className="brand-badge">{finalProduct.brand}</div>
              <h1 className="product-title">{finalProduct.name}</h1>

              {/* STORE NAME */}
              {finalProduct.shop_name && (
                <Link
                  to={`/store/${id}`}
                  className="shop-name-link"
                >
                  Sold by: <span>{finalProduct.shop_name}</span>
                </Link>
              )}


              <div className="product-rating">
                {renderRatingStars(finalProduct.rating)}
                <span className="rating-count">({finalProduct.reviews.length} reviews)</span>
              </div>

              <div className="product-price-container">
                {finalProduct.salePrice ? (
                  <>
                    <span className="original-price">${finalProduct.price.toFixed(2)}</span>
                    <span className="sale-price">${finalProduct.salePrice.toFixed(2)}</span>
                  </>
                ) : (
                  <span className="product-price">${finalProduct.price.toFixed(2)}</span>
                )}
              </div>
            </div>

            {/* Shades */}
            {finalProduct.shades?.length > 0 && (
              <div className="product-variants">
                <h3 className="variants-title">Available Shades</h3>
                <div className="shade-options">
                  {finalProduct.shades.map((shade, idx) => (
                    <button key={idx} className="shade-option" title={shade}>
                      <span className="shade-circle" style={{ backgroundColor: getShadeColor(shade) }}></span>
                      <span className="shade-name">{shade}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="product-actions">
              <div className="stock-status">
                <span className={`status-indicator ${finalProduct.inStock ? "in-stock" : "out-of-stock"}`}></span>
                {finalProduct.inStock ? "In Stock" : "Out of Stock"}
              </div>

              <div className="quantity-control">
                <button className="quantity-btn" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>−</button>
                <input
                  type="number"
                  value={quantity}
                  min="1"
                  onChange={handleInputQuantity}
                  className="quantity-input"
                />
                <button className="quantity-btn" onClick={() => handleQuantityChange(1)}>+</button>
              </div>


              <button className="add-to-cart-btn" onClick={handleAddToCart} disabled={!finalProduct.inStock}>
                Add to Cart
              </button>
            </div>

            {/* Tabs */}
            <div className="product-tabs">
              <div className="tabs-header">
                {["description", "howToUse", "ingredients", "reviews"].map((tab) => (
                  <button key={tab} className={`tab-button ${activeTab === tab ? "active" : ""}`} onClick={() => setActiveTab(tab)}>
                    {tab === "description" && "Description"}
                    {tab === "howToUse" && "How to Use"}
                    {tab === "ingredients" && "Ingredients"}
                    {tab === "reviews" && `Reviews (${finalProduct.reviews.length})`}
                  </button>
                ))}
              </div>

              <div className="tab-content">
                {activeTab === "description" && (
                  <div><p>{finalProduct.description}</p><ul>{finalProduct.features.map((f, idx) => <li key={idx}>{f}</li>)}</ul></div>
                )}
                {activeTab === "howToUse" && (
                  <div><p>{finalProduct.howToUse}</p></div>
                )}
                {activeTab === "ingredients" && (
                  <div><p>{finalProduct.ingredients}</p></div>
                )}
                {activeTab === "reviews" && (
                  <div>
                    {finalProduct.reviews.map((r) => (
                      <div key={r.id}>
                        <strong>{r.user}</strong> — {r.date}
                        {renderRatingStars(r.rating)}
                        <p>{r.text}</p>
                      </div>
                    ))}
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

export default ItemPage;
