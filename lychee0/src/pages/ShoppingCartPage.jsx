import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import "./../PagesCss/ShoppingCart.css";
import { motion } from "framer-motion";

const ShoppingCartPage = () => {
  // State for cart items
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(null);
  const [estimatedDelivery, setEstimatedDelivery] = useState("");

  // Fetch cart items - in a real app, this would come from context/redux/API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCartItems([
        {
          id: 1,
          name: "Handcrafted Ceramic Mug",
          shop_name: "ClayArtCrafts",
          variants: "Color: Ocean Blue | Size: Medium",
          price: 24.99,
          quantity: 2,
          imageUrl: "https://via.placeholder.com/150?text=Ceramic+Mug",
        },
        {
          id: 2,
          name: "Organic Honey Soap Bar",
          shop_name: "NaturalEssence",
          variants: "Scent: Lavender & Honey",
          price: 12.5,
          quantity: 1,
          imageUrl: "https://via.placeholder.com/150?text=Soap+Bar",
        },
        {
          id: 3,
          name: "Handwoven Wall Hanging",
          shop_name: "FiberArtStudio",
          variants: "Style: Bohemian | Size: Large",
          price: 89.95,
          quantity: 1,
          imageUrl: "https://via.placeholder.com/150?text=Wall+Hanging",
        },
      ]);

      // Calculate estimated delivery (5-7 business days from today)
      const today = new Date();
      const minDelivery = new Date(today);
      minDelivery.setDate(today.getDate() + 5);

      const maxDelivery = new Date(today);
      maxDelivery.setDate(today.getDate() + 7);

      const options = { month: "short", day: "numeric" };
      setEstimatedDelivery(
        `${minDelivery.toLocaleDateString(
          "en-US",
          options
        )} - ${maxDelivery.toLocaleDateString("en-US", options)}`
      );

      setLoading(false);
    }, 800);
  }, []);

  // Calculate subtotal
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  };

  // Calculate total
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const shipping = subtotal > 100 ? 0 : 7.99;
    const tax = subtotal * 0.08; // 8% tax rate
    return subtotal + shipping + tax - discount;
  };

  // Update quantity
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;

    setCartItems(
      cartItems.map((item) => {
        if (item.id === id) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  // Remove item
  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  // Apply promo code
  const applyPromo = (e) => {
    e.preventDefault();

    if (promoCode.toLowerCase() === "welcome20") {
      const subtotal = calculateSubtotal();
      setDiscount(subtotal * 0.2); // 20% off
      setPromoApplied({ code: promoCode, message: "20% discount applied!" });
    } else if (promoCode.toLowerCase() === "free5") {
      setDiscount(5);
      setPromoApplied({ code: promoCode, message: "$5 discount applied!" });
    } else {
      setPromoApplied({
        code: promoCode,
        message: "Invalid promo code",
        error: true,
      });
      setTimeout(() => setPromoApplied(null), 3000);
    }

    setPromoCode("");
  };

  if (loading) {
    return (
      <div className="shopping-cart-page">
        <NavBar />
        <div className="page-container">
          <div className="cart-container skeleton-container">
            <div className="skeleton skeleton-title"></div>
            <div className="skeleton-items">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton-item">
                  <div className="skeleton skeleton-img"></div>
                  <div className="skeleton-content">
                    <div className="skeleton skeleton-name"></div>
                    <div className="skeleton skeleton-text"></div>
                    <div className="skeleton skeleton-text-short"></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="skeleton skeleton-summary"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Empty cart view
  if (cartItems.length === 0) {
    return (
      <div className="shopping-cart-page">
        <NavBar />
        <div className="page-container">
          <div className="cart-container">
            <h1 className="cart-title">Your Shopping Cart</h1>

            <motion.div
              className="empty-cart"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="empty-cart-icon">
                <svg viewBox="0 0 24 24" width="120" height="120">
                  <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
                </svg>
              </div>
              <h2>Your cart is empty</h2>
              <p>Looks like you haven't added any items to your cart yet.</p>
              <Link to="/shops" className="continue-shopping-btn">
                Discover Amazing Products
              </Link>
            </motion.div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="shopping-cart-page">
      <NavBar />
      <div className="page-container">
        <motion.div
          className="cart-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="cart-title">Your Shopping Cart</h1>

          <div className="cart-grid">
            <div className="cart-items-section">
              <div className="cart-header">
                <span className="header-product">Product</span>
                <span className="header-price">Price</span>
                <span className="header-quantity">Quantity</span>
                <span className="header-total">Total</span>
              </div>

              <div className="cart-items">
                {cartItems.map((item) => (
                  <motion.div
                    key={item.id}
                    className="cart-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="item-product">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="item-image"
                      />
                      <div className="item-details">
                        <h3 className="item-name">{item.name}</h3>
                        <p className="item-shop">Sold by: {item.shop_name}</p>
                        <p className="item-variant">{item.variants}</p>
                        <button
                          className="remove-btn"
                          onClick={() => removeItem(item.id)}
                        >
                          <svg viewBox="0 0 24 24" width="16" height="16">
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                          </svg>
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="item-price">${item.price.toFixed(2)}</div>

                    <div className="item-quantity">
                      <button
                        className="quantity-btn decrease"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                      >
                        <svg viewBox="0 0 24 24" width="16" height="16">
                          <path d="M19 13H5v-2h14v2z" />
                        </svg>
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item.id, parseInt(e.target.value) || 1)
                        }
                        className="quantity-input"
                      />
                      <button
                        className="quantity-btn increase"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        <svg viewBox="0 0 24 24" width="16" height="16">
                          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                        </svg>
                      </button>
                    </div>

                    <div className="item-total">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="promo-section">
                <form onSubmit={applyPromo}>
                  <input
                    type="text"
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="promo-input"
                  />
                  <button
                    type="submit"
                    className="promo-btn"
                    disabled={!promoCode.trim()}
                  >
                    Apply
                  </button>
                </form>
                {promoApplied && (
                  <div
                    className={`promo-message ${
                      promoApplied.error ? "error" : "success"
                    }`}
                  >
                    {promoApplied.message}
                  </div>
                )}
              </div>
            </div>

            <div className="cart-summary-section">
              <div className="cart-summary">
                <h2 className="summary-title">Order Summary</h2>

                <div className="summary-details">
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>${calculateSubtotal().toFixed(2)}</span>
                  </div>

                  <div className="summary-row">
                    <span>Shipping</span>
                    <span>
                      {calculateSubtotal() > 100 ? (
                        <span className="free-shipping">FREE</span>
                      ) : (
                        `$7.99`
                      )}
                    </span>
                  </div>

                  <div className="summary-row">
                    <span>Tax (8%)</span>
                    <span>${(calculateSubtotal() * 0.08).toFixed(2)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="summary-row discount">
                      <span>Discount</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="summary-total">
                    <span>Total</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>

                <div className="estimated-delivery">
                  <svg viewBox="0 0 24 24" width="18" height="18">
                    <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
                  </svg>
                  <span>Estimated delivery: {estimatedDelivery}</span>
                </div>

                <Link to="/checkout" className="checkout-btn">
                  <span>Proceed to Checkout</span>
                  <svg viewBox="0 0 24 24" width="18" height="18">
                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                  </svg>
                </Link>

                <div className="secure-checkout">
                  <svg viewBox="0 0 24 24" width="16" height="16">
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                  </svg>
                  <span>Secure Checkout</span>
                </div>

                <div className="payment-methods">
                  <img
                    src="https://via.placeholder.com/40x25?text=Visa"
                    alt="Visa"
                  />
                  <img
                    src="https://via.placeholder.com/40x25?text=MC"
                    alt="MasterCard"
                  />
                  <img
                    src="https://via.placeholder.com/40x25?text=Amex"
                    alt="American Express"
                  />
                  <img
                    src="https://via.placeholder.com/40x25?text=PayPal"
                    alt="PayPal"
                  />
                </div>
              </div>

              <div className="need-help">
                <h3>Need Help?</h3>
                <ul>
                  <li>
                    <svg viewBox="0 0 24 24" width="16" height="16">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
                    </svg>
                    <a href="/faq">Shipping & Returns</a>
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" width="16" height="16">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                    </svg>
                    <a href="/contact">Contact Support</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="shopping-actions">
            <Link to="/" className="continue-shopping">
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
              </svg>
              <span>Continue Shopping</span>
            </Link>
          </div>

          <div className="recommended-products">
            <h2 className="recommendations-title">You might also like</h2>
            <div className="recommended-grid">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="recommended-item">
                  <div className="recommended-image">
                    <img
                      src={`https://via.placeholder.com/150?text=Product+${i}`}
                      alt={`Recommended product ${i}`}
                    />
                  </div>
                  <h3 className="recommended-name">Handcrafted Product {i}</h3>
                  <p className="recommended-price">
                    ${(19.99 + i * 5).toFixed(2)}
                  </p>
                  <button className="quick-add-btn">Quick Add</button>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default ShoppingCartPage;
