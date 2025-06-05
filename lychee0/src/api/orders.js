import axios from 'axios';

const API_URL = "http://localhost:8081/api/orders";

export const getAllOrders = async () => {
    try {
        const res = await axios.get(API_URL);
        return res.data;
    } catch (error) {
        console.error("Failed to fetch orders:", error);
        return [];
    }
};

export const getOrdersByUserId = async (userId) => {
    try {
        const res = await axios.get(`${API_URL}/user/${userId}`);
        return res.data;
    } catch (error) {
        console.error("Failed to fetch user orders:", error);
        return [];
    }
};

export const fetchOrders = async ({ role, status, query, startDate, endDate, userId, storeId }) => {
    const params = new URLSearchParams();

    if (role) params.append('role', role);
    if (status) params.append('status', status);
    if (query) params.append('query', query);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (userId) params.append('userId', userId);
    if (storeId) params.append('storeId', storeId); // ✅ This was missing

    try {
        const response = await axios.get(`${API_URL}/search?${params.toString()}`);
        return response.data;
    } catch (error) {
        console.error("Failed to search orders:", error);
        return [];
    }
};

export const fetchOrderItems = async (orderId) => {
    const response = await axios.get(`http://localhost:8081/api/orders/${orderId}/items`);
    return response.data;
};
