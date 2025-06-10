import axios from "axios";

const API_URL = "http://localhost:8081/api/orders";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const getAllOrders = async () => {
  try {
    const res = await api.get("");
    return res.data;
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return [];
  }
};

export const getOrdersByUserId = async (userId) => {
  try {
    const res = await api.get(`/user/${userId}`);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch user orders:", error);
    return [];
  }
};

export const fetchOrders = async ({
  role,
  status,
  query,
  startDate,
  endDate,
  userId,
  storeId,
}) => {
  const params = new URLSearchParams();

  // Only add parameters if they have values
  if (role) params.append("role", role);
  if (status) params.append("status", status);
  if (query && query.trim()) params.append("query", query.trim());
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  if (userId) params.append("user_id", userId);
  if (storeId) params.append("store_id", storeId);

  try {
    const response = await api.get(`/search?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Failed to search orders:", error);
    return [];
  }
};

export const fetchOrderItems = async (orderId) => {
  if (!orderId) {
    throw new Error("Order ID is required");
  }

  try {
    const response = await api.get(`/${orderId}/items`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch items for order ${orderId}:`, error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId, status) => {
  if (!orderId || !status) {
    throw new Error("Order ID and status are required");
  }

  try {
    await api.put(`/${orderId}/status`, { status });
  } catch (error) {
    console.error(`Failed to update order ${orderId} status:`, error);
    throw error;
  }
};

export const fetchOrderItemDetailsByStore = async (storeId, orderId) => {
  if (!storeId || !orderId) {
    throw new Error(
      `Missing storeId or orderId: storeId=${storeId}, orderId=${orderId}`
    );
  }

  try {
    const response = await api.get(
      `/order-items/store/${storeId}/order/${orderId}`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Failed to fetch items for store ${storeId} and order ${orderId}:`,
      error
    );
    throw error;
  }
};

// Additional utility functions
export const createOrder = async (orderData) => {
  try {
    const response = await api.post("", orderData);
    return response.data;
  } catch (error) {
    console.error("Failed to create order:", error);
    throw error;
  }
};

export const getOrderById = async (orderId) => {
  if (!orderId) {
    throw new Error("Order ID is required");
  }

  try {
    const response = await api.get(`/${orderId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch order ${orderId}:`, error);
    throw error;
  }
};

export const deleteOrder = async (orderId) => {
  if (!orderId) {
    throw new Error("Order ID is required");
  }

  try {
    await api.delete(`/${orderId}`);
  } catch (error) {
    console.error(`Failed to delete order ${orderId}:`, error);
    throw error;
  }
};
