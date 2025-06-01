import axios from 'axios';

const API_URL = "http://localhost:8081/api/orders"; // Ensure this matches your Spring Boot port

export const getAllOrders = async () => {
    try {
        const res = await axios.get(API_URL);
        return res.data;
    } catch (error) {
        console.error("Failed to fetch all orders:", error);
        return [];
    }
};

export const getOrdersByUserId = async (userId) => {
    try {
        const res = await axios.get(`${API_URL}/user/${userId}`);
        return res.data;
    } catch (error) {
        console.error(`Failed to fetch orders for user ${userId}:`, error);
        return [];
    }
};

export const fetchOrders = async ({ role, status, query, startDate, endDate }) => {
    const params = new URLSearchParams();
    if (role) params.append('role', role);
    if (status) params.append('status', status);
    if (query) params.append('query', query);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    try {
        const res = await axios.get(`${API_URL}/search?${params.toString()}`);
        return res.data;
    } catch (error) {
        console.error("Failed to search orders:", error);
        return [];
    }
};
