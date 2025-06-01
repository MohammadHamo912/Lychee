import axios from "axios";

// BASE URLs for different entities
const BASE_URL = "http://localhost:8081/api/products";
const VARIANT_URL = "http://localhost:8081/api/product-variants";
const ITEM_URL = "http://localhost:8081/api/items";

// Fetch all products
export const getAllProducts = async () => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data;
  } catch (err) {
    console.error("Failed to fetch products:", err);
    return [];
  }
};

// Get product by ID
export const getProductById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
  } catch (err) {
    console.error(`Failed to fetch product ${id}:`, err);
    return null;
  }
};

// Get product by barcode
export const getProductByBarcode = async (barcode) => {
  try {
    const response = await axios.get(`${BASE_URL}/barcode/${barcode}`);
    return response.data;
  } catch (err) {
    console.error(`Failed to fetch product by barcode ${barcode}:`, err);
    return null;
  }
};

export const getProductByBrand = async (brand) => {
  try {
    const response = await axios.get(`${BASE_URL}/brand/${brand}`);
    return response.data;
  } catch (err) {
    console.error(`Failed to fetch product by brand ${brand}:`, err);
    return null;
  }
};

// Search products by name
export const searchProductByName = async (name) => {
  try {
    const response = await axios.get(`${BASE_URL}/name/${name}`);
    return response.data;
  } catch (err) {
    console.error(`Failed to search product by name ${name}:`, err);
    return null;
  }
};

// Get products by category
export const getProductsByCategory = async (categoryId) => {
  try {
    const response = await axios.get(`${BASE_URL}/category/${categoryId}`);
    return response.data;
  } catch (err) {
    console.error(`Failed to fetch products for category ${categoryId}:`, err);
    return [];
  }
};

// Create a new product
export const createProduct = async (product) => {
  try {
    const response = await axios.post(BASE_URL, product);
    return response.data;
  } catch (err) {
    console.error("Failed to create product:", err);
    throw err;
  }
};

// Create a product variant (e.g. shade)
export const createProductVariant = async (variant) => {
  try {
    const response = await axios.post(VARIANT_URL, variant);
    return response.data;
  } catch (err) {
    console.error("Failed to create product variant:", err);
    throw err;
  }
};

// Create an item (store-specific product variant listing)
export const createItem = async (item) => {
  try {
    const response = await axios.post(ITEM_URL, item);
    return response.data;
  } catch (err) {
    console.error("Failed to create item:", err);
    throw err;
  }
};

// Update an existing product
export const updateProduct = async (product) => {
  try {
    const response = await axios.put(BASE_URL, product);
    return response.data;
  } catch (err) {
    console.error("Failed to update product:", err);
    throw err;
  }
};

// Delete a product by ID
export const deleteProduct = async (id) => {
  try {
    await axios.delete(`${BASE_URL}/${id}`);
    return true;
  } catch (err) {
    console.error(`Failed to delete product ${id}:`, err);
    throw err;
  }
};
