import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../ComponentsCss/CheckoutForm.css";

const CheckoutForm = ({ onSubmit, cartTotal }) => {
  const [formData, setFormData] = useState({
    // Contact Information
    email: "",
    phone: "",

    // Shipping Information
    firstName: "",
    lastName: "",
    address: "",
    apartmentUnit: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",

    // Billing Information
    sameAsShipping: true,
    billingFirstName: "",
    billingLastName: "",
    billingAddress: "",
    billingApartmentUnit: "",
    billingCity: "",
    billingState: "",
    billingZipCode: "",
    billingCountry: "United States",

    // Payment Method
    paymentMethod: "creditCard",
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",

    // Order Notes
    orderNotes: "",

    // Terms and Newsletter
    agreeToTerms: false,
    subscribeToNewsletter: false,
  });

  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error message when field is updated
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      // Validate contact and shipping
      if (!formData.email) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.email))
        newErrors.email = "Email is invalid";

      if (!formData.firstName) newErrors.firstName = "First name is required";
      if (!formData.lastName) newErrors.lastName = "Last name is required";
      if (!formData.address) newErrors.address = "Address is required";
      if (!formData.city) newErrors.city = "City is required";
      if (!formData.state) newErrors.state = "State is required";
      if (!formData.zipCode) newErrors.zipCode = "ZIP code is required";
    }

    if (step === 2) {
      // Validate billing if not same as shipping
      if (!formData.sameAsShipping) {
        if (!formData.billingFirstName)
          newErrors.billingFirstName = "First name is required";
        if (!formData.billingLastName)
          newErrors.billingLastName = "Last name is required";
        if (!formData.billingAddress)
          newErrors.billingAddress = "Address is required";
        if (!formData.billingCity) newErrors.billingCity = "City is required";
        if (!formData.billingState)
          newErrors.billingState = "State is required";
        if (!formData.billingZipCode)
          newErrors.billingZipCode = "ZIP code is required";
      }
    }

    if (step === 3) {
      // Validate payment
      if (formData.paymentMethod === "creditCard") {
        if (!formData.cardName)
          newErrors.cardName = "Cardholder name is required";
        if (!formData.cardNumber)
          newErrors.cardNumber = "Card number is required";
        else if (!/^\d{15,16}$/.test(formData.cardNumber.replace(/\s/g, "")))
          newErrors.cardNumber = "Card number is invalid";

        if (!formData.expiryDate)
          newErrors.expiryDate = "Expiry date is required";
        else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiryDate))
          newErrors.expiryDate = "Expiry date should be MM/YY";

        if (!formData.cvv) newErrors.cvv = "CVV is required";
        else if (!/^\d{3,4}$/.test(formData.cvv))
          newErrors.cvv = "CVV is invalid";
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
      window.scrollTo(0, 0);
    } else {
      setErrors(errors);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateStep(3);

    if (Object.keys(errors).length === 0) {
      // Submit the form
      onSubmit(formData);
    } else {
      setErrors(errors);
    }
  };

  // Format credit card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  return (
    <div className="checkout-form-container">
      <div className="checkout-steps">
        <div
          className={`step ${currentStep === 1 ? "active" : ""} ${
            currentStep > 1 ? "completed" : ""
          }`}
        >
          <span className="step-number">1</span>
          <span className="step-title">Shipping</span>
        </div>
        <div
          className={`step ${currentStep === 2 ? "active" : ""} ${
            currentStep > 2 ? "completed" : ""
          }`}
        >
          <span className="step-number">2</span>
          <span className="step-title">Billing</span>
        </div>
        <div className={`step ${currentStep === 3 ? "active" : ""}`}>
          <span className="step-number">3</span>
          <span className="step-title">Payment</span>
        </div>
      </div>

      <form className="checkout-form" onSubmit={handleSubmit}>
        {/* Step 1: Shipping Information */}
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
                />
                {errors.lastName && (
                  <span className="error-message">{errors.lastName}</span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="address">Address*</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={errors.address ? "error" : ""}
              />
              {errors.address && (
                <span className="error-message">{errors.address}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="apartmentUnit">
                Apartment, Suite, etc. (Optional)
              </label>
              <input
                type="text"
                id="apartmentUnit"
                name="apartmentUnit"
                value={formData.apartmentUnit}
                onChange={handleChange}
              />
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
                />
                {errors.city && (
                  <span className="error-message">{errors.city}</span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="state">State/Province*</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className={errors.state ? "error" : ""}
                />
                {errors.state && (
                  <span className="error-message">{errors.state}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="zipCode">ZIP/Postal Code*</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className={errors.zipCode ? "error" : ""}
                />
                {errors.zipCode && (
                  <span className="error-message">{errors.zipCode}</span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="country">Country*</label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                >
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="United Kingdom">United Kingdom</option>
                  {/* Add more countries as needed */}
                </select>
              </div>
            </div>

            <div className="form-buttons">
              <Link to="/shoppingcart" className="secondary-button">
                Back to Cart
              </Link>
              <button
                type="button"
                className="primary-button"
                onClick={() => handleStepChange(2)}
              >
                Continue to Billing
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Billing Information */}
        {currentStep === 2 && (
          <div className="checkout-step-content">
            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="sameAsShipping"
                name="sameAsShipping"
                checked={formData.sameAsShipping}
                onChange={handleChange}
              />
              <label htmlFor="sameAsShipping">Same as shipping address</label>
            </div>

            {!formData.sameAsShipping && (
              <>
                <h3>Billing Address</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="billingFirstName">First Name*</label>
                    <input
                      type="text"
                      id="billingFirstName"
                      name="billingFirstName"
                      value={formData.billingFirstName}
                      onChange={handleChange}
                      className={errors.billingFirstName ? "error" : ""}
                    />
                    {errors.billingFirstName && (
                      <span className="error-message">
                        {errors.billingFirstName}
                      </span>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="billingLastName">Last Name*</label>
                    <input
                      type="text"
                      id="billingLastName"
                      name="billingLastName"
                      value={formData.billingLastName}
                      onChange={handleChange}
                      className={errors.billingLastName ? "error" : ""}
                    />
                    {errors.billingLastName && (
                      <span className="error-message">
                        {errors.billingLastName}
                      </span>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="billingAddress">Address*</label>
                  <input
                    type="text"
                    id="billingAddress"
                    name="billingAddress"
                    value={formData.billingAddress}
                    onChange={handleChange}
                    className={errors.billingAddress ? "error" : ""}
                  />
                  {errors.billingAddress && (
                    <span className="error-message">
                      {errors.billingAddress}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="billingApartmentUnit">
                    Apartment, Suite, etc. (Optional)
                  </label>
                  <input
                    type="text"
                    id="billingApartmentUnit"
                    name="billingApartmentUnit"
                    value={formData.billingApartmentUnit}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="billingCity">City*</label>
                    <input
                      type="text"
                      id="billingCity"
                      name="billingCity"
                      value={formData.billingCity}
                      onChange={handleChange}
                      className={errors.billingCity ? "error" : ""}
                    />
                    {errors.billingCity && (
                      <span className="error-message">
                        {errors.billingCity}
                      </span>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="billingState">State/Province*</label>
                    <input
                      type="text"
                      id="billingState"
                      name="billingState"
                      value={formData.billingState}
                      onChange={handleChange}
                      className={errors.billingState ? "error" : ""}
                    />
                    {errors.billingState && (
                      <span className="error-message">
                        {errors.billingState}
                      </span>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="billingZipCode">ZIP/Postal Code*</label>
                    <input
                      type="text"
                      id="billingZipCode"
                      name="billingZipCode"
                      value={formData.billingZipCode}
                      onChange={handleChange}
                      className={errors.billingZipCode ? "error" : ""}
                    />
                    {errors.billingZipCode && (
                      <span className="error-message">
                        {errors.billingZipCode}
                      </span>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="billingCountry">Country*</label>
                    <select
                      id="billingCountry"
                      name="billingCountry"
                      value={formData.billingCountry}
                      onChange={handleChange}
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      {/* Add more countries as needed */}
                    </select>
                  </div>
                </div>
              </>
            )}

            <div className="form-group">
              <label htmlFor="orderNotes">Order Notes (Optional)</label>
              <textarea
                id="orderNotes"
                name="orderNotes"
                value={formData.orderNotes}
                onChange={handleChange}
                placeholder="Special instructions for delivery or gift messages"
              ></textarea>
            </div>

            <div className="form-buttons">
              <button
                type="button"
                className="secondary-button"
                onClick={() => setCurrentStep(1)}
              >
                Back to Shipping
              </button>
              <button
                type="button"
                className="primary-button"
                onClick={() => handleStepChange(3)}
              >
                Continue to Payment
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Payment Information */}
        {currentStep === 3 && (
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
                  <span className="payment-icon">MC</span>
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
                    placeholder="Name as it appears on card"
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
                    onChange={(e) => {
                      const formattedValue = formatCardNumber(e.target.value);
                      setFormData({ ...formData, cardNumber: formattedValue });
                      if (errors.cardNumber) {
                        setErrors({ ...errors, cardNumber: "" });
                      }
                    }}
                    className={errors.cardNumber ? "error" : ""}
                    placeholder="XXXX XXXX XXXX XXXX"
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
                      placeholder="XXX"
                      maxLength="4"
                    />
                    {errors.cvv && (
                      <span className="error-message">{errors.cvv}</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="order-summary">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="summary-row">
                <span>Tax</span>
                <span>${(cartTotal * 0.08).toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>${(cartTotal + cartTotal * 0.08).toFixed(2)}</span>
              </div>
            </div>

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
                <a href="/terms" target="_blank" rel="noopener noreferrer">
                  Terms & Conditions
                </a>
              </label>
              {errors.agreeToTerms && (
                <span className="error-message">{errors.agreeToTerms}</span>
              )}
            </div>

            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="subscribeToNewsletter"
                name="subscribeToNewsletter"
                checked={formData.subscribeToNewsletter}
                onChange={handleChange}
              />
              <label htmlFor="subscribeToNewsletter">
                Subscribe to our newsletter for exclusive updates and offers
              </label>
            </div>

            <div className="form-buttons">
              <button
                type="button"
                className="secondary-button"
                onClick={() => setCurrentStep(2)}
              >
                Back to Billing
              </button>
              <button type="submit" className="primary-button">
                Complete Order
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default CheckoutForm;
