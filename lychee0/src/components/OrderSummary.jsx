import React, { useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import "../ComponentsCss/OrderSummary.css";

const OrderSummary = ({
  cartItems,
  subtotal,
  tax,
  shipping,
  discount,
  total,
  onProceedToPayment,
}) => {
  const [promoCode, setPromoCode] = useState("");
  const [promoMessage, setPromoMessage] = useState("");
  const [promoSuccess, setPromoSuccess] = useState(false);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toLowerCase() === "welcome10") {
      setPromoMessage("Promo code applied successfully!");
      setPromoSuccess(true);
      // In a real app, you would call a function to update the discount
    } else {
      setPromoMessage("Invalid promo code. Please try again.");
      setPromoSuccess(false);
    }
  };

  return (
    <div className="order-summary">
      <h2 className="order-summary-title">Order Summary</h2>

      {/* Items List */}
      <div className="order-items">
        <h3>Items ({cartItems.length})</h3>
        {cartItems.map((item) => (
          <div key={item.id} className="order-item">
            <div className="order-item-image-container">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="order-item-image"
              />
              <span className="order-item-quantity">{item.quantity}</span>
            </div>
            <div className="order-item-details">
              <p className="order-item-name">{item.name}</p>
              <p className="order-item-shop">{item.shop_name}</p>
            </div>
            <p className="order-item-price">
              ${(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      {/* Promo Code */}
      <div className="promo-section">
        <form onSubmit={handleApplyPromo} className="promo-form">
          <input
            type="text"
            placeholder="Enter promo code"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            className="promo-input"
          />
          <button type="submit" className="promo-button">
            Apply
          </button>
        </form>
        {promoMessage && (
          <p className={`promo-message ${promoSuccess ? "success" : "error"}`}>
            {promoMessage}
          </p>
        )}
      </div>

      {/* Price Breakdown */}
      <div className="price-breakdown">
        <div className="price-row">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="price-row">
          <span>Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="price-row">
          <span>Shipping</span>
          <span>${shipping.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="price-row discount">
            <span>Discount</span>
            <span>-${discount.toFixed(2)}</span>
          </div>
        )}
        <div className="price-row total">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <div className="order-summary-actions">
        <button className="proceed-button" onClick={onProceedToPayment}>
          Proceed to Payment
        </button>
        <Link to="/products" className="continue-shopping">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

OrderSummary.propTypes = {
  cartItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      name: PropTypes.string.isRequired,
      imageUrl: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      quantity: PropTypes.number.isRequired,
      shop_name: PropTypes.string,
    })
  ).isRequired,
  subtotal: PropTypes.number.isRequired,
  tax: PropTypes.number.isRequired,
  shipping: PropTypes.number.isRequired,
  discount: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  onProceedToPayment: PropTypes.func.isRequired,
};

export default OrderSummary;
