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

  const calculateSubtotal = (items) => {
    return items.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  };

  const handlePromoSubmit = (e) => {
    e.preventDefault();
    if (promoCode.trim()) {
      applyPromo(promoCode);
      setPromoCode("");
    }
  };

  const CartItem = ({ item }) => (
    <div className="cart-item" key={item.id}>
      <div className="product-info">
        <img src={item.imageUrl} alt={item.name} className="cart-item-image" />
        <div className="product-details">
          <h3>{item.name}</h3>
          {item.shop_name && (
            <p className="shop-name">Sold by: {item.shop_name}</p>
          )}
          {item.variants && <p className="variant-info">{item.variants}</p>}
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
  );

  const EmptyCart = () => (
    <div className="empty-cart-message">
      <svg
        className="empty-cart-icon"
        viewBox="0 0 24 24"
        width="64"
        height="64"
      >
        <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
      </svg>
      <p>Your cart is currently empty.</p>
      <Link to="/shops" className="continue-shopping-btn">
        Continue Shopping
      </Link>
    </div>
  );

  const subtotal = calculateSubtotal(cartItems);

  return (
    <div className="shopping-cart">
      <h2>Your Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <EmptyCart />
      ) : (
        <>
          <div className="cart-header">
            <span className="product-info-header">Product</span>
            <span className="product-price-header">Price</span>
            <span className="product-quantity-header">Quantity</span>
            <span className="product-total-header">Total</span>
          </div>

          <div className="cart-items">
            {cartItems.map((item) => (
              <CartItem item={item} key={item.id} />
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
                <button
                  type="submit"
                  className="apply-promo-btn"
                  disabled={!promoCode.trim()}
                >
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
        </>
      )}
    </div>
  );
};

export default ShoppingCart;
