import axios from "axios";

import { getAllProductVariants } from "./productvariant";
import { getAllProducts } from "./products";

const API_URL = "http://localhost:8081/api/items";
let productVariants = [];
let products = [];

const loadDependencies = async () => {
  if (productVariants.length === 0) {
    productVariants = await getAllProductVariants();
  }
  if (products.length === 0) {
    products = await getAllProducts();
  }
};

const enrichItemData = async (items) => {
  await loadDependencies();
  return items.map((item) => {
    const variant = productVariants.find((v) => v.id === item.productVariantId);
    const product = variant
      ? products.find((p) => p.id === variant.productId)
      : null;

    return {
      ...item,
      name: product?.name || `Product ${item.productVariantId}`,
      category: product?.category || "Uncategorized",
      description: product?.description || "No description available",
      image: variant?.image || "/images/default.jpg",
      price: parseFloat(item.price),
      discount: parseFloat(item.discount),
      stock: item.stockQuantity,
    };
  });
};
// Get all items
export const getAllItems = async () => {
  try {
    const response = await axios.get(API_URL);
    return enrichItemData(response.data);
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
};

// Get item by ID
export const getItemById = async (itemId) => {
  try {
    const response = await axios.get(`${API_URL}/${itemId}`);
    return enrichItemData([response.data])[0];
  } catch (error) {
    console.error(`Error fetching item ${itemId}:`, error);
    throw error;
  }
};

// Get items by store ID
export const getItemsByStoreId = async (storeId) => {
  try {
    const response = await axios.get(`${API_URL}/store/${storeId}`);
    return enrichItemData(response.data);
  } catch (error) {
    console.error(
      `Error fetching items for store ${storeId}, falling back to filtering all items:`,
      error
    );

    // Fallback: Get all items and filter by storeId
    try {
      const allItems = await getAllItems();
      return allItems.filter((item) => item.storeId == storeId);
    } catch (fallbackError) {
      console.error("Fallback also failed:", fallbackError);
      throw error;
    }
  }
};

// Get items by product variant ID
export const getItemsByProductVariantId = async (variantId) => {
  try {
    const response = await axios.get(`${API_URL}/variant/${variantId}`);
    return enrichItemData(response.data);
  } catch (error) {
    console.error(`Error fetching items for variant ${variantId}:`, error);
    throw error;
  }
};

// Get items by price range
export const getItemsByPriceRange = async (minPrice, maxPrice) => {
  try {
    const response = await axios.get(`${API_URL}/price-range`, {
      params: { minPrice, maxPrice },
    });
    return enrichItemData(response.data);
  } catch (error) {
    console.error(`Error fetching items in price range:`, error);
    throw error;
  }
};

// Search items by product name
export const searchItemsByProductName = async (productName) => {
  try {
    const response = await axios.get(`${API_URL}/search`, {
      params: { productName },
    });
    return enrichItemData(response.data);
  } catch (error) {
    console.error(`Error searching items by name ${productName}:`, error);
    throw error;
  }
};

// Create new item
export const createItem = async (itemData) => {
  try {
    const response = await axios.post(API_URL, itemData);
    return enrichItemData([response.data])[0];
  } catch (error) {
    console.error("Error creating item:", error);
    throw error;
  }
};

// Update item
export const updateItem = async (itemId, itemData) => {
  try {
    const response = await axios.put(`${API_URL}/${itemId}`, itemData);
    return enrichItemData([response.data])[0];
  } catch (error) {
    console.error(`Error updating item ${itemId}:`, error);
    throw error;
  }
};

// Update stock quantity
export const updateStock = async (itemId, quantity) => {
  try {
    await axios.patch(`${API_URL}/${itemId}/stock`, null, {
      params: { quantity },
    });
    return true;
  } catch (error) {
    console.error(`Error updating stock for item ${itemId}:`, error);
    throw error;
  }
};

// Update price
export const updatePrice = async (itemId, price) => {
  try {
    await axios.patch(`${API_URL}/${itemId}/price`, null, {
      params: { price },
    });
    return true;
  } catch (error) {
    console.error(`Error updating price for item ${itemId}:`, error);
    throw error;
  }
};

// Update discount
export const updateDiscount = async (itemId, discount) => {
  try {
    await axios.patch(`${API_URL}/${itemId}/discount`, null, {
      params: { discount },
    });
    return true;
  } catch (error) {
    console.error(`Error updating discount for item ${itemId}:`, error);
    throw error;
  }
};

// Delete item (soft delete)
export const deleteItem = async (itemId) => {
  try {
    await axios.delete(`${API_URL}/${itemId}`);
    return true;
  } catch (error) {
    console.error(`Error deleting item ${itemId}:`, error);
    throw error;
  }
};
