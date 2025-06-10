import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import CheckoutForm from "../components/CheckoutForm";
import { getCartItems } from "../api/checkout";
import { useUser } from "../context/UserContext";
import "../PagesCss/CheckoutPage.css";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get discount data from navigation state
  const discountData = location.state || {};
  const {
    discount = 0,
    promoApplied = null,
    subtotal = 0,
    shipping = 0,
  } = discountData;

  useEffect(() => {
    console.log("CheckoutPage - Current user from context:", user);
    console.log("CheckoutPage - Discount data from navigation:", discountData);

    // Check if user is logged in and get the correct user ID field
    const userId = user?.user_id || user?.userId || user?.User_ID;

    if (!user || !userId) {
      console.log("CheckoutPage - No user found, redirecting to login");
      navigate("/login");
      return;
    }

    // User is logged in, fetch cart items
    fetchCartItems(userId);
  }, [user, navigate]);

  const fetchCartItems = async (userId) => {
    try {
      setIsLoading(true);
      setError(null);

      console.log("CheckoutPage - Fetching cart items for user:", userId);
      const items = await getCartItems(userId);

      if (!items || items.length === 0) {
        console.log(
          "CheckoutPage - No items in cart, redirecting to cart page"
        );
        navigate("/shoppingcartpage");
        return;
      }

      setCartItems(items);

      // Calculate total
      let calculatedSubtotal;
      if (subtotal > 0) {
        // Use subtotal from cart page if available
        calculatedSubtotal = subtotal;
      } else {
        // Fallback: calculate from items
        calculatedSubtotal = items.reduce((sum, item) => {
          return sum + (item.cartItemTotal || 0);
        }, 0);
      }

      const calculatedShipping =
        shipping || (calculatedSubtotal > 100 ? 0 : 7.99);
      const total = calculatedSubtotal + calculatedShipping - discount;

      setCartTotal(total);
    } catch (err) {
      console.error("CheckoutPage - Error fetching cart items:", err);
      setError("Failed to load cart items. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOrderComplete = (orderId) => {
    console.log("CheckoutPage - Order completed:", orderId);
    navigate(`/order-success/${orderId}`);
  };

  // Calculate display values
  const displaySubtotal =
    subtotal > 0
      ? subtotal
      : cartItems.reduce((sum, item) => {
          return sum + (item.cartItemTotal || 0);
        }, 0);

  const displayShipping = shipping || (displaySubtotal > 100 ? 0 : 7.99);

  if (isLoading) {
    return (
      <div className="checkout-page">
        <NavBar />
        <div className="checkout-loading">
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
          <p>Loading your cart...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="checkout-page">
        <NavBar />
        <div className="checkout-error">
          <h2>Unable to Load Checkout</h2>
          <p>{error}</p>
          <button
            onClick={() => navigate("/shoppingcartpage")}
            className="primary-button"
          >
            Return to Cart
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <NavBar />

      <div className="checkout-header">
        <div className="checkout-header-content">
          <h1>Checkout</h1>
          <p>Complete your order safely and securely</p>
        </div>
      </div>

      <div className="checkout-content">
        <div className="checkout-main">
          <CheckoutForm
            cartItems={cartItems}
            cartTotal={cartTotal}
            userId={user?.user_id || user?.userId || user?.User_ID}
            onOrderComplete={handleOrderComplete}
            discount={discount}
            promoApplied={promoApplied}
            subtotal={subtotal}
            shipping={shipping}
          />
        </div>

        <div className="checkout-sidebar">
          <div className="order-summary-card">
            <h3>Order Summary</h3>
            <div className="summary-items">
              {cartItems.map(
                (item) => (
                  console.log("CheckoutPage - Rendering item:", item),
                  (
                    <div key={item.itemId} className="summary-item">
                      <div className="item-details">
                        <img
                          src={item.image || "/default-product.jpg"}
                          alt={item.name}
                          className="item-image"
                        />
                        <div className="item-info">
                          <h4>{item.name}</h4>
                          <p className="item-brand">{item.brand}</p>
                          <p className="item-variant">
                            {item.currentVariant?.size &&
                              `Size: ${item.current_variant.size}`}
                            {item.currentVariant?.color &&
                              ` | Color: ${item.current_variant.color}`}
                          </p>
                          <p className="item-quantity">
                            Quantity: {item.cart_quantity}
                          </p>
                        </div>
                      </div>
                      <div className="item-price">
                        $
                        {(
                          (item.final_price || item.price) * item.cart_quantity
                        ).toFixed(2)}
                      </div>
                    </div>
                  )
                )
              )}
            </div>

            <div className="summary-totals">
              <div className="summary-row">
                <span>Subtotal ({cartItems.length} items)</span>
                <span>${displaySubtotal.toFixed(2)}</span>
              </div>

              <div className="summary-row">
                <span>Shipping</span>
                <span>
                  {displayShipping === 0
                    ? "Free"
                    : `$${displayShipping.toFixed(2)}`}
                </span>
              </div>

              {/* Show discount if applied */}
              {discount > 0 && promoApplied && (
                <div className="summary-row discount">
                  <span>Discount ({promoApplied.code})</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}

              <div className="summary-row total">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CheckoutPage;
