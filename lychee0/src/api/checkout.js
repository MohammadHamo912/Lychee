// api/checkout.js
import axios from "axios";

const API_BASE_URL = "http://localhost:8081/api";

// Get user information from User table
export const getUserInfo = async (userId) => {
  try {
    console.log("API - Getting user info for user:", userId);
    const response = await axios.get(`${API_BASE_URL}/users/${userId}`);
    console.log("API - Retrieved user info:", response.data);
    return response.data;
  } catch (error) {
    console.error("API - Error fetching user info:", error);
    throw error;
  }
};

// Get user's cart items with product details
export const getCartItems = async (userId) => {
  try {
    console.log("API - Getting cart items for user:", userId);
    const response = await axios.get(`${API_BASE_URL}/checkout/cart/${userId}`);
    console.log("API - Retrieved cart items:", response.data.length);
    return response.data;
  } catch (error) {
    console.error("API - Error fetching cart items:", error);
    throw error;
  }
};

// Process complete checkout (updated to handle dummy payment)
export const processCheckout = async (checkoutData) => {
  try {
    console.log("API - Processing checkout for user:", checkoutData.user_id);
    const response = await axios.post(
      `${API_BASE_URL}/checkout/process`,
      checkoutData
    );
    console.log("API - Checkout response:", response.data);
    return response.data;
  } catch (error) {
    console.error("API - Error processing checkout:", error);
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "Checkout failed");
    }
    throw error;
  }
};

// Remove the validatePayment function since we're using dummy payment
// If you need it for future real payment integration, you can keep it commented:

/*
export const validatePayment = async (paymentData, amount) => {
  try {
    console.log("API - Validating payment for amount:", amount);
    const response = await axios.post(
      `${API_BASE_URL}/checkout/validate-payment`,
      {
        paymentData,
        amount,
      }
    );
    console.log("API - Payment validation response:", response.data);
    return response.data;
  } catch (error) {
    console.error("API - Error validating payment:", error);
    if (error.response && error.response.data) {
      throw new Error(
        error.response.data.message || "Payment validation failed"
      );
    }
    throw error;
  }
};
*/
