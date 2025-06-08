import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import "./../PagesCss/ShoppingCart.css";
import { motion } from "framer-motion";
import ShoppingCartAPI from "../api/shoppingcartitems";
import { getEnrichedItemsByIds } from "../api/items"; // Import the new enriched API
import { useUser } from "../context/UserContext";

const ShoppingCartPage = () => {
  const { user, isLoggedIn } = useUser();

  // State for cart items and user
  const [cartItems, setCartItems] = useState([]);
  const [enrichedCartItems, setEnrichedCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(null);
  const [estimatedDelivery, setEstimatedDelivery] = useState("");
  const [updating, setUpdating] = useState({});

  const userId = user?.userId || user?.id;

  // Debug logs
  console.log("ShoppingCartPage - User:", user);
  console.log("ShoppingCartPage - User ID:", userId);
  console.log("ShoppingCartPage - Is Logged In:", isLoggedIn);

  // Fetch cart items and enrich them with product data
  const fetchCartItems = async () => {
    if (!userId) {
      console.log("ShoppingCartPage - No user ID, skipping cart fetch");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log("ShoppingCartPage - Fetching cart items for user:", userId);

      // Step 1: Get cart items from cart API
      const apiCartItems = await ShoppingCartAPI.getCartItems(userId);
      console.log("ShoppingCartPage - Cart API returned:", apiCartItems);

      if (apiCartItems.length === 0) {
        setCartItems([]);
        setEnrichedCartItems([]);
        setLoading(false);
        return;
      }

      // Step 2: Extract item IDs from cart
      const itemIds = apiCartItems.map((cartItem) => cartItem.itemId);
      console.log("ShoppingCartPage - Item IDs to enrich:", itemIds);

      // Step 3: Get enriched item data
      const enrichedItems = await getEnrichedItemsByIds(itemIds);
      console.log("ShoppingCartPage - Enriched items:", enrichedItems);

      // Step 4: Merge cart data with enriched item data
      const mergedCartItems = apiCartItems.map((cartItem) => {
        const enrichedItem = enrichedItems.find(
          (item) => item.id === cartItem.itemId
        );

        if (enrichedItem) {
          return {
            // Cart-specific data
            cartId: `${cartItem.userId}-${cartItem.itemId}`,
            userId: cartItem.userId,
            itemId: cartItem.itemId,
            quantity: cartItem.quantity,
            addedAt: cartItem.createdAt,
            updatedAt: cartItem.updatedAt,

            // Enriched product data
            id: enrichedItem.id,
            name: enrichedItem.name || `Product ${cartItem.itemId}`,
            description: enrichedItem.description || "No description available",
            brand: enrichedItem.brand || "Unknown Brand",
            image: enrichedItem.image || "/images/default.jpg",
            price: enrichedItem.price || 25.0,
            finalPrice: enrichedItem.finalPrice || enrichedItem.price || 25.0,
            discount: enrichedItem.discount || 0,
            stock: enrichedItem.stock || enrichedItem.stockQuantity || 0,
            storeName: enrichedItem.storeName || "Unknown Store",
            currentVariant: enrichedItem.currentVariant,
            availableVariants: enrichedItem.availableVariants || [],
          };
        } else {
          // Fallback for items without enriched data
          return {
            cartId: `${cartItem.userId}-${cartItem.itemId}`,
            userId: cartItem.userId,
            itemId: cartItem.itemId,
            quantity: cartItem.quantity,
            addedAt: cartItem.createdAt,
            updatedAt: cartItem.updatedAt,

            id: cartItem.itemId,
            name: `Product ${cartItem.itemId}`,
            description: "Product information not available",
            brand: "Unknown Brand",
            image: "/images/default.jpg",
            price: 0,
            finalPrice: 0,
            discount: 0,
            stock: 0,
            storeName: "Unknown Store",
            currentVariant: null,
            availableVariants: [],
          };
        }
      });

      console.log("ShoppingCartPage - Merged cart items:", mergedCartItems);

      setCartItems(apiCartItems);
      setEnrichedCartItems(mergedCartItems);

      // Calculate estimated delivery
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
    } catch (err) {
      console.error("Error fetching cart items:", err);
      setError("Failed to load cart items. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Load cart items on component mount and when user changes
  useEffect(() => {
    fetchCartItems();
  }, [userId]);

  // Calculate subtotal using real prices from enriched data
  const calculateSubtotal = () => {
    return enrichedCartItems.reduce((total, item) => {
      return total + item.finalPrice * item.quantity;
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
  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      setUpdating((prev) => ({ ...prev, [itemId]: true }));

      await ShoppingCartAPI.updateCartItemQuantity(userId, itemId, newQuantity);

      // Update local state for both cart items and enriched cart items
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.itemId === itemId ? { ...item, quantity: newQuantity } : item
        )
      );

      setEnrichedCartItems((prevItems) =>
        prevItems.map((item) =>
          item.itemId === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (err) {
      console.error("Error updating quantity:", err);
      setError("Failed to update quantity. Please try again.");
    } finally {
      setUpdating((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  // Remove item
  const removeItem = async (itemId) => {
    try {
      setUpdating((prev) => ({ ...prev, [itemId]: true }));

      await ShoppingCartAPI.removeFromCart(userId, itemId);

      // Update local state
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.itemId !== itemId)
      );

      setEnrichedCartItems((prevItems) =>
        prevItems.filter((item) => item.itemId !== itemId)
      );

      // Reset promo if cart becomes empty
      if (enrichedCartItems.length === 1) {
        setDiscount(0);
        setPromoApplied(null);
      }
    } catch (err) {
      console.error("Error removing item:", err);
      setError("Failed to remove item. Please try again.");
    } finally {
      setUpdating((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    try {
      setLoading(true);
      await ShoppingCartAPI.clearCart(userId);
      setCartItems([]);
      setEnrichedCartItems([]);
      setDiscount(0);
      setPromoApplied(null);
    } catch (err) {
      console.error("Error clearing cart:", err);
      setError("Failed to clear cart. Please try again.");
    } finally {
      setLoading(false);
    }
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

  // Error display component
  const ErrorMessage = ({ message, onRetry }) => (
    <motion.div
      className="error-message"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: "#fee",
        border: "1px solid #fcc",
        borderRadius: "8px",
        padding: "12px 16px",
        margin: "16px 0",
        color: "#c33",
        fontSize: "14px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <span>{message}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            background: "#c33",
            color: "white",
            border: "none",
            borderRadius: "4px",
            padding: "4px 8px",
            fontSize: "12px",
            cursor: "pointer",
          }}
        >
          Retry
        </button>
      )}
    </motion.div>
  );

  // Show login message if not logged in
  if (!isLoggedIn) {
    return (
      <div className="shopping-cart-page">
        <NavBar />
        <div className="page-container">
          <div className="cart-container">
            <motion.div
              className="empty-cart"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2>Please log in to view your cart</h2>
              <p>You need to be logged in to access your shopping cart.</p>
              <Link to="/login" className="continue-shopping-btn">
                Login
              </Link>
            </motion.div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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
  if (enrichedCartItems.length === 0 && !loading) {
    return (
      <div className="shopping-cart-page">
        <NavBar />
        <div className="page-container">
          <div className="cart-container">
            <h1 className="cart-title">Your Shopping Cart</h1>

            {error && <ErrorMessage message={error} onRetry={fetchCartItems} />}

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
              <Link to="/" className="continue-shopping-btn">
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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h1 className="cart-title">Your Shopping Cart</h1>
            {enrichedCartItems.length > 0 && (
              <button
                onClick={clearCart}
                style={{
                  background: "#ff4444",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  padding: "8px 16px",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                Clear Cart
              </button>
            )}
          </div>

          {error && <ErrorMessage message={error} onRetry={fetchCartItems} />}

          <div className="cart-grid">
            <div className="cart-items-section">
              <div className="cart-header">
                <span className="header-product">Product</span>
                <span className="header-price">Price</span>
                <span className="header-quantity">Quantity</span>
                <span className="header-total">Total</span>
              </div>

              <div className="cart-items">
                {enrichedCartItems.map((item) => (
                  <motion.div
                    key={item.itemId}
                    className="cart-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      opacity: updating[item.itemId] ? 0.6 : 1,
                      pointerEvents: updating[item.itemId] ? "none" : "auto",
                    }}
                  >
                    <div className="item-product">
                      <div className="item-image">
                        {item.image && item.image !== "/images/default.jpg" ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="product-image"
                          />
                        ) : (
                          <div className="item-image-placeholder">
                            <span>{item.name.charAt(0)}</span>
                          </div>
                        )}
                      </div>
                      <div className="item-details">
                        <h3 className="item-name">{item.name}</h3>
                        <p className="item-shop">Sold by: {item.storeName}</p>
                        <p className="item-brand">Brand: {item.brand}</p>
                        {item.currentVariant && (
                          <p className="item-variant">
                            {item.currentVariant.size !== "default" &&
                              `Size: ${item.currentVariant.size}`}
                            {item.currentVariant.size !== "default" &&
                              item.currentVariant.color !== "default" &&
                              " | "}
                            {item.currentVariant.color !== "default" &&
                              `Color: ${item.currentVariant.color}`}
                          </p>
                        )}
                        <p className="item-added">
                          Added: {new Date(item.addedAt).toLocaleDateString()}
                        </p>
                        <button
                          className="remove-btn"
                          onClick={() => removeItem(item.itemId)}
                          disabled={updating[item.itemId]}
                        >
                          <svg viewBox="0 0 24 24" width="16" height="16">
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                          </svg>
                          {updating[item.itemId] ? "Removing..." : "Remove"}
                        </button>
                      </div>
                    </div>

                    <div className="item-price">
                      {item.discount > 0 ? (
                        <div className="price-with-discount">
                          <span className="original-price">
                            ${item.price.toFixed(2)}
                          </span>
                          <span className="final-price">
                            ${item.finalPrice.toFixed(2)}
                          </span>
                          <span className="discount-badge">
                            -{item.discount}%
                          </span>
                        </div>
                      ) : (
                        <span className="final-price">
                          ${item.finalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>

                    <div className="item-quantity">
                      <button
                        className="quantity-btn decrease"
                        onClick={() =>
                          updateQuantity(item.itemId, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1 || updating[item.itemId]}
                      >
                        <svg viewBox="0 0 24 24" width="16" height="16">
                          <path d="M19 13H5v-2h14v2z" />
                        </svg>
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => {
                          const newQuantity = parseInt(e.target.value) || 1;
                          if (newQuantity !== item.quantity) {
                            updateQuantity(item.itemId, newQuantity);
                          }
                        }}
                        className="quantity-input"
                        disabled={updating[item.itemId]}
                      />
                      <button
                        className="quantity-btn increase"
                        onClick={() =>
                          updateQuantity(item.itemId, item.quantity + 1)
                        }
                        disabled={updating[item.itemId]}
                      >
                        <svg viewBox="0 0 24 24" width="16" height="16">
                          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                        </svg>
                      </button>
                    </div>

                    <div className="item-total">
                      ${(item.finalPrice * item.quantity).toFixed(2)}
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

                <Link to="/checkout" className="checkout-btn">
                  <span>Proceed to Checkout</span>
                  <svg viewBox="0 0 24 24" width="18" height="18">
                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                  </svg>
                </Link>
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
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default ShoppingCartPage;
