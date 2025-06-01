import axios from "axios";

const API_URL = "http://localhost:8081/api/stores";

// Get all stores
export const getAllStores = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching stores:", error);
    throw error;
  }
};

// Get store by ID
export const getStoreById = async (storeId) => {
  try {
    const response = await axios.get(`${API_URL}/${storeId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching store ${storeId}:`, error);
    throw error;
  }
};

// Get store by owner ID
export const getStoreByOwnerId = async (ownerId) => {
  try {
    const response = await axios.get(`${API_URL}/owner/${ownerId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching store for owner ${ownerId}:`, error);
    throw error;
  }
};

// Create new store
export const createStore = async (storeData) => {
  try {
    const response = await axios.post(API_URL, storeData);
    return response.data;
  } catch (error) {
    console.error("Error creating store:", error);
    throw error;
  }
};

// Update store
export const updateStore = async (storeId, storeData) => {
  try {
    const response = await axios.put(`${API_URL}/${storeId}`, storeData);
    return response.data;
  } catch (error) {
    console.error(`Error updating store ${storeId}:`, error);
    throw error;
  }
};

// Delete store (soft delete)
export const deleteStore = async (storeId) => {
  try {
    await axios.delete(`${API_URL}/${storeId}`);
    return true;
  } catch (error) {
    console.error(`Error deleting store ${storeId}:`, error);
    throw error;
  }
};
// Get store products
export const getStoreProducts = async (storeId) => {
  try {
    const response = await axios.get(`${API_URL}/${storeId}/products`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching products for store ${storeId}:`, error);
    throw error;
  }
};

// Get store sales data
export const getStoreSalesData = async (storeId, period) => {
  try {
    const response = await axios.get(
      `${API_URL}/${storeId}/sales?period=${period}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching sales data for store ${storeId}:`, error);
    throw error;
  }
};

// Upload store logo
export const uploadStoreLogo = async (storeId, file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(`${API_URL}/${storeId}/logo`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error uploading logo for store ${storeId}:`, error);
    throw error;
  }
};
