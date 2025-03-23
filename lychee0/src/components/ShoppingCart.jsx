import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../ComponentsCss/ShoppingCart.css";

const ShoppingCart = ({
  cartItems = [],
  updateQuantity,
  removeItem,
  applyPromo,
}) => {
  const [promoCode, setPromoCode] = useState("");

  const subtotal = cartItems.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  if (cartItems.length === 0) {
    return (
      <div className="shopping-cart empty-cart">
        <h2>Your Shopping Cart</h2>
        <div className="empty-cart-message">
          <p>Your cart is currently empty.</p>
          <Link to="/shops" className="continue-shopping-btn">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const handlePromoSubmit = (e) => {
    e.preventDefault();
    applyPromo(promoCode);
    setPromoCode("");
  };

  return (
    <div className="shopping-cart">
      <h2>Your Shopping Cart</h2>
      <div className="cart-header">
        <span className="product-info-header">Product</span>
        <span className="product-price-header">Price</span>
        <span className="product-quantity-header">Quantity</span>
        <span className="product-total-header">Total</span>
      </div>

      <div className="cart-items">
        {cartItems.map((item) => (
          <div className="cart-item" key={item.id}>
            <div className="product-info">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="cart-item-image"
              />
              <div className="product-details">
                <h3>{item.name}</h3>
                {item.shop_name && (
                  <p className="shop-name">Sold by: {item.shop_name}</p>
                )}
                {item.variants && (
                  <p className="variant-info">{item.variants}</p>
                )}
                <button
                  className="remove-item-btn"
                  onClick={() => removeItem(item.id)}
                  aria-label={`Remove ${item.name} from cart`}
                >
                  Remove
                </button>
              </div>
            </div>

            <div className="product-price">${item.price.toFixed(2)}</div>

            <div className="product-quantity">
              <button
                className="quantity-btn"
                onClick={() =>
                  updateQuantity(item.id, Math.max(1, item.quantity - 1))
                }
                disabled={item.quantity <= 1}
                aria-label="Decrease quantity"
              >
                -
              </button>
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) =>
                  updateQuantity(item.id, parseInt(e.target.value) || 1)
                }
                className="quantity-input"
                aria-label="Item quantity"
              />
              <button
                className="quantity-btn"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <div className="product-total">
              ${(item.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      <div className="cart-actions">
        <div className="promo-code-section">
          <form onSubmit={handlePromoSubmit}>
            <input
              type="text"
              placeholder="Promo Code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="promo-input"
              aria-label="Enter promo code"
            />
            <button type="submit" className="apply-promo-btn">
              Apply
            </button>
          </form>
        </div>

        <div className="cart-summary">
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="cart-buttons">
            <Link to="/shops" className="continue-shopping-btn">
              Continue Shopping
            </Link>
            <Link to="/checkout" className="checkout-btn">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
