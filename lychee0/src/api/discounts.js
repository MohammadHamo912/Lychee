import axios from "axios";

const API_URL = "http://localhost:8081/api/discounts";

export const getAllDiscounts = async () => {
    const res = await axios.get(API_URL);
    return res.data;
};

export const createDiscount = async (discount) => {
    await axios.post(API_URL, discount);
};

export const toggleDiscount = async (id) => {
    await axios.put(`${API_URL}/${id}/toggle`);
};

export const deleteDiscount = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
};
