import axios from "axios";

const API_URL = "http://localhost:8081/api/admin/overview";

const handleError = (context, error) => {
  const message = error?.response?.data?.message || error.message;
  console.error(`❌ Error fetching ${context}:`, message);
  throw new Error(`Failed to fetch ${context}: ${message}`);
};

export const getDashboardSummary = async () => {
  try {
    const response = await axios.get(`${API_URL}/summary`);
    return response.data;
  } catch (error) {
    handleError("dashboard summary", error);
  }
};

export const getOrderTrends = async () => {
  try {
    const response = await axios.get(`${API_URL}/order-trends`);
    return response.data;
  } catch (error) {
    handleError("order trends", error);
  }
};

export const getOrderStatusData = async () => {
  try {
    const response = await axios.get(`${API_URL}/order-status`);
    return response.data;
  } catch (error) {
    handleError("order status data", error);
  }
};

export const getRecentUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/recent-users`);
    return response.data;
  } catch (error) {
    handleError("recent users", error);
  }
};

export const getRecentShops = async () => {
  try {
    const response = await axios.get(`${API_URL}/recent-shops`);
    return response.data;
  } catch (error) {
    handleError("recent shops", error);
  }
};

export const getRecentOrders = async () => {
  try {
    const response = await axios.get(`${API_URL}/recent-orders`);
    return response.data;
  } catch (error) {
    handleError("recent orders", error);
  }
};
