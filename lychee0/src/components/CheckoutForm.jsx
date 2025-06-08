import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { processCheckout, getUserInfo } from "../api/checkout";
import "../ComponentsCss/CheckoutForm.css";

const CheckoutForm = ({ cartItems, cartTotal, userId, onOrderComplete }) => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [formData, setFormData] = useState({
    city: "",
    street: "",
    building: "",
    orderNotes: "",
    paymentMethod: "creditCard",
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [loadingUserInfo, setLoadingUserInfo] = useState(true);

  // Fetch user information on component mount
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setLoadingUserInfo(true);
        const userData = await getUserInfo(userId);
        setUserInfo(userData);
      } catch (error) {
        console.error("Error fetching user info:", error);
        setErrors({ general: "Failed to load user information" });
      } finally {
        setLoadingUserInfo(false);
      }
    };

    if (userId) {
      fetchUserInfo();
    }
  }, [userId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.city) newErrors.city = "City is required";
      if (!formData.street) newErrors.street = "Street is required";
      if (!formData.building) newErrors.building = "Building is required";
    }

    if (step === 2) {
      if (!formData.paymentMethod)
        newErrors.paymentMethod = "Please select a payment method";
    }

    return newErrors;
  };

  const handleStepChange = (step) => {
    const errors = validateStep(currentStep);
    if (Object.keys(errors).length === 0) {
      setCurrentStep(step);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setErrors(errors);
    }
  };

  const simulatePaymentProcessing = () => {
    return new Promise((resolve) => {
      // Simulate payment processing delay
      setTimeout(() => {
        // For demo purposes, always succeed
        // You could add logic here to randomly fail sometimes for testing
        const success = Math.random() > 0.1; // 90% success rate
        resolve({
          success: success,
          transactionId: success
            ? `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
            : null,
          message: success
            ? "Payment processed successfully"
            : "Payment failed. Please try again.",
        });
      }, 2000); // 2 second delay to simulate processing
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateStep(2);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing
      const paymentResult = await simulatePaymentProcessing();

      if (!paymentResult.success) {
        setErrors({ payment: paymentResult.message });
        setIsProcessing(false);
        return;
      }

      // Prepare checkout data
      const checkoutData = {
        userId: userId,
        shippingAddress: {
          firstName: userInfo.name.split(" ")[0] || userInfo.name,
          lastName: userInfo.name.split(" ").slice(1).join(" ") || "",
          city: formData.city,
          street: formData.street,
          building: formData.building,
        },
        paymentData: {
          paymentMethod: formData.paymentMethod,
          transactionId: paymentResult.transactionId,
          // For dummy payment, we just send the method and transaction ID
        },
        orderNotes: formData.orderNotes,
        contactInfo: {
          email: userInfo.email,
          phone: userInfo.phone,
        },
        cartItems: cartItems,
      };

      // Process checkout
      const result = await processCheckout(checkoutData);

      if (result.success) {
        setOrderSuccess(true);
        if (onOrderComplete) {
          onOrderComplete(result.orderId);
        }
        // Redirect to success page after a short delay
        setTimeout(() => {
          navigate(`/order-success/${result.orderId}`);
        }, 2000);
      } else {
        setErrors({ checkout: result.message });
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setErrors({ checkout: "Failed to process order. Please try again." });
    } finally {
      setIsProcessing(false);
    }
  };

  // Show loading while fetching user info
  if (loadingUserInfo) {
    return (
      <div className="checkout-form-container">
        <div className="loading-user-info">
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
          <p>Loading your information...</p>
        </div>
      </div>
    );
  }

  // Show error if user info couldn't be loaded
  if (!userInfo) {
    return (
      <div className="checkout-form-container">
        <div className="error-banner">
          {errors.general ||
            "Failed to load user information. Please refresh the page."}
        </div>
      </div>
    );
  }

  // Show success message
  if (orderSuccess) {
    return (
      <div className="checkout-form-container">
        <div className="order-success">
          <h2>Order Placed Successfully! 🎉</h2>
          <p>
            Thank you for your order. You will be redirected to the confirmation
            page shortly.
          </p>
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-form-container">
      <div className="checkout-steps">
        <div
          className={`step ${currentStep === 1 ? "active" : ""} ${
            currentStep > 1 ? "completed" : ""
          }`}
          onClick={() => currentStep > 1 && setCurrentStep(1)}
        >
          <span className="step-number">1</span>
          <span className="step-title">Address</span>
        </div>
        <div className={`step ${currentStep === 2 ? "active" : ""}`}>
          <span className="step-number">2</span>
          <span className="step-title">Payment</span>
        </div>
      </div>

      {/* Display general errors */}
      {(errors.checkout || errors.payment || errors.general) && (
        <div className="error-banner">
          {errors.checkout || errors.payment || errors.general}
        </div>
      )}

      <form className="checkout-form" onSubmit={handleSubmit}>
        {currentStep === 1 && (
          <div className="checkout-step-content">
            <h3>Your Information</h3>
            <div className="user-info-display">
              <div className="info-item">
                <label>Name:</label>
                <span className="info-value">{userInfo.name}</span>
              </div>
              <div className="info-item">
                <label>Email:</label>
                <span className="info-value">{userInfo.email}</span>
              </div>
              {userInfo.phone && (
                <div className="info-item">
                  <label>Phone:</label>
                  <span className="info-value">{userInfo.phone}</span>
                </div>
              )}
            </div>

            <h3>Shipping Address</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City*</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={errors.city ? "error" : ""}
                  placeholder="Enter your city"
                />
                {errors.city && (
                  <span className="error-message">{errors.city}</span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="street">Street*</label>
                <input
                  type="text"
                  id="street"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  className={errors.street ? "error" : ""}
                  placeholder="Enter street name"
                />
                {errors.street && (
                  <span className="error-message">{errors.street}</span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="building">Building*</label>
              <input
                type="text"
                id="building"
                name="building"
                value={formData.building}
                onChange={handleChange}
                className={errors.building ? "error" : ""}
                placeholder="Building number or name"
              />
              {errors.building && (
                <span className="error-message">{errors.building}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="orderNotes">Order Notes (Optional)</label>
              <textarea
                id="orderNotes"
                name="orderNotes"
                value={formData.orderNotes}
                onChange={handleChange}
                placeholder="Special instructions for delivery or gift messages"
              />
            </div>

            <div className="form-buttons">
              <Link to="/shoppingcartpage" className="secondary-button">
                Back to Cart
              </Link>
              <button
                type="button"
                className="primary-button"
                onClick={() => handleStepChange(2)}
              >
                Continue to Payment
              </button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="checkout-step-content">
            <h3>Payment Method</h3>
            <div className="payment-notice">
              <p className="demo-notice">
                🎭 <strong>Demo Mode:</strong> This is a simulated payment
                system. No real charges will be made.
              </p>
            </div>

            <div className="payment-methods">
              <div
                className={`payment-method ${
                  formData.paymentMethod === "creditCard" ? "selected" : ""
                }`}
                onClick={() =>
                  setFormData({ ...formData, paymentMethod: "creditCard" })
                }
              >
                <input
                  type="radio"
                  id="creditCard"
                  name="paymentMethod"
                  value="creditCard"
                  checked={formData.paymentMethod === "creditCard"}
                  onChange={handleChange}
                />
                <label htmlFor="creditCard"> Credit Card (Demo)</label>
                <div className="payment-description">
                  <small>Simulated credit card payment</small>
                </div>
              </div>

              <div
                className={`payment-method ${
                  formData.paymentMethod === "cashOnDelivery" ? "selected" : ""
                }`}
                onClick={() =>
                  setFormData({ ...formData, paymentMethod: "cashOnDelivery" })
                }
              >
                <input
                  type="radio"
                  id="cashOnDelivery"
                  name="paymentMethod"
                  value="cashOnDelivery"
                  checked={formData.paymentMethod === "cashOnDelivery"}
                  onChange={handleChange}
                />
                <label htmlFor="cashOnDelivery"> Cash on Delivery</label>
                <div className="payment-description">
                  <small>Pay when your order is delivered</small>
                </div>
              </div>
            </div>

            <div className="order-summary-preview">
              <h4>Order Summary</h4>
              <div className="summary-line">
                <span>Subtotal:</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="summary-line">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="summary-line total">
                <span>Total:</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="form-buttons">
              <button
                type="button"
                className="secondary-button"
                onClick={() => setCurrentStep(1)}
              >
                Back to Address
              </button>
              <button
                type="submit"
                className="primary-button"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <span className="processing-spinner"></span>
                    Processing Payment...
                  </>
                ) : (
                  `Complete Order - $${cartTotal.toFixed(2)}`
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default CheckoutForm;
