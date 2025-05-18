import axios from "axios";

const BASE_URL = "http://localhost:8081/api/products";

export const getAllProducts = async () => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data;
  } catch (err) {
    console.error("Failed to fetch products:", err);
    return [];
  }
};

export const getProductById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
  } catch (err) {
    console.error(`Failed to fetch product ${id}:`, err);
    return null;
  }
};

export const getProductByBarcode = async (barcode) => {
  try {
    const response = await axios.get(`${BASE_URL}/barcode/${barcode}`);
    return response.data;
  } catch (err) {
    console.error(`Failed to fetch product by barcode ${barcode}:`, err);
    return null;
  }
};

export const searchProductByName = async (name) => {
  try {
    const response = await axios.get(`${BASE_URL}/name/${name}`);
    return response.data;
  } catch (err) {
    console.error(`Failed to search product by name ${name}:`, err);
    return null;
  }
};

export const getProductsByCategory = async (categoryId) => {
  try {
    const response = await axios.get(`${BASE_URL}/category/${categoryId}`);
    return response.data;
  } catch (err) {
    console.error(`Failed to fetch products for category ${categoryId}:`, err);
    return [];
  }
};

export const createProduct = async (product) => {
  try {
    const response = await axios.post(BASE_URL, product);
    return response.data;
  } catch (err) {
    console.error("Failed to create product:", err);
    throw err;
  }
};

export const updateProduct = async (product) => {
  try {
    const response = await axios.put(BASE_URL, product);
    return response.data;
  } catch (err) {
    console.error("Failed to update product:", err);
    throw err;
  }
};

export const deleteProduct = async (id) => {
  try {
    await axios.delete(`${BASE_URL}/${id}`);
    return true;
  } catch (err) {
    console.error(`Failed to delete product ${id}:`, err);
    throw err;
  }
};
