import axios from "axios";

const BASE_URL = "http://localhost:8081/api/productvariants";

export const getAllProductVariants = async () => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data;
  } catch (err) {
    console.error("Failed to fetch product variants:", err);
    return [];
  }
};

export const getProductVariantById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
  } catch (err) {
    console.error(`Failed to fetch product variant ${id}:`, err);
    return null;
  }
};

export const getProductVariantsByProductId = async (productId) => {
  try {
    const response = await axios.get(`${BASE_URL}/product/${productId}`);
    return response.data;
  } catch (err) {
    console.error(
      `Failed to fetch product variants for product ${productId}:`,
      err
    );
    return [];
  }
};

export const createProductVariant = async (productVariant) => {
  try {
    const response = await axios.post(BASE_URL, productVariant);
    return response.data;
  } catch (err) {
    console.error("Failed to create product variant:", err);
    throw err;
  }
};

export const updateProductVariant = async (productVariant) => {
  try {
    const response = await axios.put(BASE_URL, productVariant);
    return response.data;
  } catch (err) {
    console.error("Failed to update product variant:", err);
    throw err;
  }
};

export const deleteProductVariant = async (id) => {
  try {
    await axios.delete(`${BASE_URL}/${id}`);
    return true;
  } catch (err) {
    console.error(`Failed to delete product variant ${id}:`, err);
    throw err;
  }
};
