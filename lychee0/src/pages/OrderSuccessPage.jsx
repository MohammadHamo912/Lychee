import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import "../PagesCss/OrderSuccessPage.css";

const OrderSuccessPage = () => {
  return (
    <div className="order-success-page">
      <NavBar />

      <div className="success-container">
        <div className="success-header">
          <div className="success-icon">✅</div>
          <h1>Order Confirmed!</h1>
          <p className="success-subtitle">
            Thank you for your order. We've received your order and it will be
            processed shortly.
          </p>
        </div>

        <div className="next-steps">
          <h3>What's Next?</h3>
          <div className="steps-grid">
            <div className="step">
              <div className="step-icon">📧</div>
              <h4>Confirmation Email</h4>
              <p>You'll receive an order confirmation email soon.</p>
            </div>
            <div className="step">
              <div className="step-icon">📦</div>
              <h4>Processing</h4>
              <p>We'll prepare your order for shipment.</p>
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <Link to="/" className="primary-button">
            Continue Shopping
          </Link>
        </div>

        <div className="support-info">
          <h4>Need Help?</h4>
          <p>
            If you have any questions about your order, please{" "}
            <Link to="/contact">contact our support team</Link>.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrderSuccessPage;
