import axios from "axios";

const API_URL = "http://localhost:8081/api/admin/overview";

// 🛠 Helper to handle and rethrow errors with clarity
const handleError = (context, error) => {
    const message = error?.response?.data?.message || error.message;
    console.error(`❌ Error fetching ${context}:`, message);
    throw new Error(`Failed to fetch ${context}: ${message}`);
};

// ✅ Get dashboard summary
export const getDashboardSummary = async () => {
    try {
        const response = await axios.get(`${API_URL}/summary`);
        return response.data;
    } catch (error) {
        handleError("dashboard summary", error);
    }
};

// ✅ Get order trends
export const getOrderTrends = async () => {
    try {
        const response = await axios.get(`${API_URL}/order-trends`);
        return response.data;
    } catch (error) {
        handleError("order trends", error);
    }
};

// ✅ Get order status breakdown
export const getOrderStatusData = async () => {
    try {
        const response = await axios.get(`${API_URL}/order-status`);
        return response.data;
    } catch (error) {
        handleError("order status data", error);
    }
};

// ✅ Get recent users
export const getRecentUsers = async () => {
    try {
        const response = await axios.get(`${API_URL}/recent-users`);
        return response.data;
    } catch (error) {
        handleError("recent users", error);
    }
};

// ✅ Get recent shops
export const getRecentShops = async () => {
    try {
        const response = await axios.get(`${API_URL}/recent-shops`);
        return response.data;
    } catch (error) {
        handleError("recent shops", error);
    }
};

// ✅ Get recent orders
export const getRecentOrders = async () => {
    try {
        const response = await axios.get(`${API_URL}/recent-orders`);
        return response.data;
    } catch (error) {
        handleError("recent orders", error);
    }
};
