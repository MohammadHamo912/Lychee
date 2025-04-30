import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/products';

export const getAllProducts = async () => {
    try {
        const response = await axios.get(BASE_URL);
        return response.data;
    } catch (err) {
        console.error('Failed to fetch products:', err);
        return [];
    }
};

export const createProduct = async (product) => {
    try {
        const response = await axios.post(BASE_URL, product);
        return response.data;
    } catch (err) {
        console.error('Failed to create product:', err);
        throw err;
    }
};
