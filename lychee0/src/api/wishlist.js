import axios from "axios";

const BASE_URL = "http://localhost:8081/api/wishlist";

export const getWishlist = async (userId) => {
    const res = await axios.get(`${BASE_URL}/${userId}`);
    return res.data;
};

export const addToWishlist = async (userId, productVariantId) => {
    await axios.post(`${BASE_URL}/add`, null, {
        params: { userId, productVariantId },
    });
};

export const removeFromWishlist = async (userId, productVariantId) => {
    await axios.delete(`${BASE_URL}/remove`, {
        params: { userId, productVariantId },
    });
};

export const clearWishlist = async (userId) => {
    await axios.delete(`${BASE_URL}/clear/${userId}`);
};
