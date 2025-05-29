import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import "./../ComponentsCss/OrderConfirmation.css";

const OrderConfirmation = ({
  orderNumber,
  orderDate,
  shippingAddress,
  billingAddress,
  paymentMethod,
  items,
  subtotal,
  tax,
  shipping,
  discount,
  total,
}) => {
  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Estimate delivery date (7 days from order)
  const estimateDelivery = (dateString) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 7);
    return formatDate(date);
  };

  return (
    <div className="order-confirmation">
      <div className="confirmation-header">
        <div className="confirmation-icon">✓</div>
        <h1 className="confirmation-title">Order Confirmed!</h1>
        <p className="confirmation-message">
          Thank you for your purchase. Your order has been received and is being
          processed.
        </p>
      </div>

      <div className="order-details-card">
        <div className="order-info">
          <div className="order-info-item">
            <span className="info-label">Order Number:</span>
            <span className="info-value">{orderNumber}</span>
          </div>
          <div className="order-info-item">
            <span className="info-label">Order Date:</span>
            <span className="info-value">{formatDate(orderDate)}</span>
          </div>
          <div className="order-info-item">
            <span className="info-label">Estimated Delivery:</span>
            <span className="info-value">{estimateDelivery(orderDate)}</span>
          </div>
        </div>

        <div className="order-addresses">
          <div className="address-column">
            <h3>Shipping Address</h3>
            <address>
              {shippingAddress.name}
              <br />
              {shippingAddress.street}
              <br />
              {shippingAddress.city}, {shippingAddress.state}{" "}
              {shippingAddress.zip}
              <br />
              {shippingAddress.country}
            </address>
          </div>
          <div className="address-column">
            <h3>Billing Address</h3>
            <address>
              {billingAddress.name}
              <br />
              {billingAddress.street}
              <br />
              {billingAddress.city}, {billingAddress.state} {billingAddress.zip}
              <br />
              {billingAddress.country}
            </address>
          </div>
          <div className="address-column">
            <h3>Payment Method</h3>
            <p className="payment-info">
              {paymentMethod.type}
              <br />
              {paymentMethod.type === "Credit Card" &&
                `**** **** **** ${paymentMethod.last4}`}
            </p>
          </div>
        </div>

        <div className="order-items-summary">
          <h3>Order Items</h3>
          <div className="confirmation-items-list">
            {items.map((item) => (
              <div key={item.id} className="confirmation-item">
                <div className="confirmation-item-image-container">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="confirmation-item-image"
                  />
                </div>
                <div className="confirmation-item-details">
                  <p className="confirmation-item-name">{item.name}</p>
                  <p className="confirmation-item-shop">{item.shop_name}</p>
                </div>
                <div className="confirmation-item-pricing">
                  <p className="confirmation-item-quantity">
                    Qty: {item.quantity}
                  </p>
                  <p className="confirmation-item-price">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="order-total-summary">
          <div className="total-row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="total-row">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="total-row">
            <span>Shipping</span>
            <span>${shipping.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className="total-row discount">
              <span>Discount</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
          )}
          <div className="total-row grand-total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="confirmation-actions">
        <Link to="/order-tracking" className="track-order-button">
          Track Your Order
        </Link>
        <Link to="/products" className="continue-shopping-link">
          Continue Shopping
        </Link>
      </div>

      <div className="help-section">
        <h3>Need Help?</h3>
        <p>
          If you have any questions about your order, please visit our{" "}
          <Link to="/faq">FAQ page</Link> or{" "}
          <Link to="/contact">contact us</Link>.
        </p>
      </div>
    </div>
  );
};

OrderConfirmation.propTypes = {
  orderNumber: PropTypes.string.isRequired,
  orderDate: PropTypes.string.isRequired,
  shippingAddress: PropTypes.shape({
    name: PropTypes.string.isRequired,
    street: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
    zip: PropTypes.string.isRequired,
    country: PropTypes.string.isRequired,
  }).isRequired,
  billingAddress: PropTypes.shape({
    name: PropTypes.string.isRequired,
    street: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
    zip: PropTypes.string.isRequired,
    country: PropTypes.string.isRequired,
  }).isRequired,
  paymentMethod: PropTypes.shape({
    type: PropTypes.string.isRequired,
    last4: PropTypes.string,
  }).isRequired,
  items: PropTypes.arrayOf(
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
};

export default OrderConfirmation;
