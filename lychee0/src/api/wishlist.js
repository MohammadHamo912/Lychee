import axios from "axios";

const BASE_URL = "http://localhost:8081/api/wishlist";

export const getWishlist = async (userId) => {
    if (!userId) throw new Error("userId is required");
    const res = await axios.get(`${BASE_URL}/${userId}`);
    return res.data;
};

export const addToWishlist = async (userId, itemId) => {
    if (!userId || !itemId) throw new Error("userId and itemId are required");
    await axios.post(`${BASE_URL}/add`, null, { params: { userId, itemId } });
};

export const removeFromWishlist = async (userId, itemId) => {
    if (!userId || !itemId) throw new Error("userId and itemId are required");
    await axios.delete(`${BASE_URL}/remove`, { params: { userId, itemId } });
};

export const clearWishlist = async (userId) => {
    if (!userId) throw new Error("userId is required");
    await axios.delete(`${BASE_URL}/clear/${userId}`);
};
