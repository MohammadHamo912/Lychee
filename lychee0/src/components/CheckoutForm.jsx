import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { processCheckout, validatePayment } from "../api/checkout";
import "../ComponentsCss/CheckoutForm.css";

const CheckoutForm = ({ cartItems, cartTotal, userId, onOrderComplete }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    city: "",
    street: "",
    building: "",
    orderNotes: "",
    paymentMethod: "creditCard",
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

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
      if (!formData.email) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.email))
        newErrors.email = "Email is invalid";
      if (!formData.firstName) newErrors.firstName = "First name is required";
      if (!formData.lastName) newErrors.lastName = "Last name is required";
      if (!formData.city) newErrors.city = "City is required";
      if (!formData.street) newErrors.street = "Street is required";
      if (!formData.building) newErrors.building = "Building is required";
    }

    if (step === 2) {
      if (formData.paymentMethod === "creditCard") {
        if (!formData.cardName)
          newErrors.cardName = "Cardholder name is required";
        if (!formData.cardNumber)
          newErrors.cardNumber = "Card number is required";
        else if (!/^\d{15,16}$/.test(formData.cardNumber.replace(/\s/g, "")))
          newErrors.cardNumber = "Card number must be 15-16 digits";
        if (!formData.expiryDate)
          newErrors.expiryDate = "Expiry date is required";
        else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiryDate))
          newErrors.expiryDate = "Use MM/YY format";
        if (!formData.cvv) newErrors.cvv = "CVV is required";
        else if (!/^\d{3,4}$/.test(formData.cvv))
          newErrors.cvv = "CVV must be 3-4 digits";
      }
      if (!formData.agreeToTerms)
        newErrors.agreeToTerms = "You must agree to the terms";
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateStep(2);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsProcessing(true);

    try {
      // Validate payment first
      if (formData.paymentMethod === "creditCard") {
        const paymentValidation = await validatePayment(
          {
            paymentMethod: formData.paymentMethod,
            cardNumber: formData.cardNumber.replace(/\s/g, ""),
            expiryDate: formData.expiryDate,
            cvv: formData.cvv,
          },
          cartTotal
        );

        if (!paymentValidation.success) {
          setErrors({ payment: paymentValidation.message });
          setIsProcessing(false);
          return;
        }
      }

      // Prepare checkout data
      const checkoutData = {
        userId: userId,
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          city: formData.city,
          street: formData.street,
          building: formData.building,
        },
        paymentData: {
          paymentMethod: formData.paymentMethod,
          cardName: formData.cardName,
          cardNumber: formData.cardNumber.replace(/\s/g, ""),
          expiryDate: formData.expiryDate,
          cvv: formData.cvv,
        },
        orderNotes: formData.orderNotes,
        contactInfo: {
          email: formData.email,
          phone: formData.phone,
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

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : value;
  };

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
          <span className="step-title">Information</span>
        </div>
        <div className={`step ${currentStep === 2 ? "active" : ""}`}>
          <span className="step-number">2</span>
          <span className="step-title">Payment</span>
        </div>
      </div>

      {/* Display general errors */}
      {(errors.checkout || errors.payment) && (
        <div className="error-banner">{errors.checkout || errors.payment}</div>
      )}

      <form className="checkout-form" onSubmit={handleSubmit}>
        {currentStep === 1 && (
          <div className="checkout-step-content">
            <h3>Contact Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email Address*</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? "error" : ""}
                  placeholder="Email Address"
                />
                {errors.email && (
                  <span className="error-message">{errors.email}</span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number (Optional)</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                />
              </div>
            </div>

            <h3>Shipping Address</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name*</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={errors.firstName ? "error" : ""}
                  placeholder="First Name"
                />
                {errors.firstName && (
                  <span className="error-message">{errors.firstName}</span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name*</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={errors.lastName ? "error" : ""}
                  placeholder="Last Name"
                />
                {errors.lastName && (
                  <span className="error-message">{errors.lastName}</span>
                )}
              </div>
            </div>

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
                  placeholder="City"
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
                  placeholder="Street"
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
                placeholder="Building"
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
                <label htmlFor="creditCard">Credit Card</label>
                <div className="payment-icons">
                  <span className="payment-icon">Visa</span>
                  <span className="payment-icon">MasterCard</span>
                  <span className="payment-icon">Amex</span>
                </div>
              </div>
              <div
                className={`payment-method ${
                  formData.paymentMethod === "paypal" ? "selected" : ""
                }`}
                onClick={() =>
                  setFormData({ ...formData, paymentMethod: "paypal" })
                }
              >
                <input
                  type="radio"
                  id="paypal"
                  name="paymentMethod"
                  value="paypal"
                  checked={formData.paymentMethod === "paypal"}
                  onChange={handleChange}
                />
                <label htmlFor="paypal">PayPal</label>
                <div className="payment-icons">
                  <span className="payment-icon">PayPal</span>
                </div>
              </div>
            </div>

            {formData.paymentMethod === "creditCard" && (
              <div className="credit-card-form">
                <div className="form-group">
                  <label htmlFor="cardName">Cardholder Name*</label>
                  <input
                    type="text"
                    id="cardName"
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleChange}
                    className={errors.cardName ? "error" : ""}
                    placeholder="John Doe"
                  />
                  {errors.cardName && (
                    <span className="error-message">{errors.cardName}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="cardNumber">Card Number*</label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cardNumber: formatCardNumber(e.target.value),
                      })
                    }
                    className={errors.cardNumber ? "error" : ""}
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                  />
                  {errors.cardNumber && (
                    <span className="error-message">{errors.cardNumber}</span>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="expiryDate">Expiry Date*</label>
                    <input
                      type="text"
                      id="expiryDate"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      className={errors.expiryDate ? "error" : ""}
                      placeholder="MM/YY"
                      maxLength="5"
                    />
                    {errors.expiryDate && (
                      <span className="error-message">{errors.expiryDate}</span>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="cvv">CVV*</label>
                    <input
                      type="text"
                      id="cvv"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleChange}
                      className={errors.cvv ? "error" : ""}
                      placeholder="123"
                      maxLength="4"
                    />
                    {errors.cvv && (
                      <span className="error-message">{errors.cvv}</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="agreeToTerms"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className={errors.agreeToTerms ? "error" : ""}
              />
              <label htmlFor="agreeToTerms">
                I agree to the{" "}
                <Link to="/terms" target="_blank" rel="noopener noreferrer">
                  Terms & Conditions
                </Link>
              </label>
              {errors.agreeToTerms && (
                <span className="error-message">{errors.agreeToTerms}</span>
              )}
            </div>

            <div className="form-buttons">
              <button
                type="button"
                className="secondary-button"
                onClick={() => setCurrentStep(1)}
              >
                Back to Information
              </button>
              <button
                type="submit"
                className="primary-button"
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Complete Order"}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default CheckoutForm;
