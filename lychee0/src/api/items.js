import axios from "axios";

const API_URL = "http://localhost:8081/api/items";

// ========== NEW ENRICHED ENDPOINTS (RECOMMENDED) ==========

// Get all enriched items
export const getAllItems = async () => {
  try {
    console.log("API - Getting all enriched items");
    const response = await axios.get(`${API_URL}/enriched`);
    console.log("API - Got", response.data.length, "enriched items");
    return response.data;
  } catch (error) {
    console.error("Error fetching enriched items:", error);
    throw error;
  }
};

// Get trending enriched items
export const getTrendingItems = async () => {
  try {
    console.log("API - Getting trending enriched items");
    const response = await axios.get(`${API_URL}/enriched/trending`);
    console.log("API - Got", response.data.length, "trending items");
    return response.data;
  } catch (error) {
    console.error("Error fetching trending enriched items:", error);
    throw error;
  }
};

// Get enriched item by ID
export const getItemById = async (itemId) => {
  try {
    console.log("API - Getting enriched item by ID:", itemId);
    const response = await axios.get(`http://localhost:8081/api/items/enriched/${itemId}`);
    console.log("API - Got enriched item:", response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching enriched item ${itemId}:`, error);
    throw error;
  }
};


// Get enriched items by store ID
export const getItemsByStoreId = async (storeId) => {
  try {
    console.log("API - Getting enriched items by store ID:", storeId);
    const response = await axios.get(`${API_URL}/enriched/store/${storeId}`);
    console.log("API - Got", response.data.length, "items for store", storeId);
    return response.data;
  } catch (error) {
    console.error(`Error fetching enriched items for store ${storeId}:`, error);
    throw error;
  }
};

// Search enriched items
export const searchItemsByProductName = async (query) => {
  try {
    console.log("API - Searching enriched items with query:", query);
    const response = await axios.get(`${API_URL}/enriched/search`, {
      params: { query },
    });
    console.log("API - Found", response.data.length, "items for query:", query);
    return response.data;
  } catch (error) {
    console.error(`Error searching enriched items with query ${query}:`, error);
    throw error;
  }
};

// Search enriched items in store
export const searchItemsInStore = async (storeId, query) => {
  try {
    console.log(
      "API - Searching enriched items in store",
      storeId,
      "with query:",
      query
    );
    const response = await axios.get(
      `${API_URL}/enriched/store/${storeId}/search`,
      {
        params: { query },
      }
    );
    console.log("API - Found", response.data.length, "items in store search");
    return response.data;
  } catch (error) {
    console.error(`Error searching enriched items in store ${storeId}:`, error);
    throw error;
  }
};

// Get enriched items by IDs
export const getEnrichedItemsByIds = async (itemIds) => {
  try {
    console.log("API - Getting enriched items by IDs:", itemIds);
    const response = await axios.post(`${API_URL}/enriched/by-ids`, itemIds);
    console.log("API - Got", response.data.length, "items by IDs");
    return response.data;
  } catch (error) {
    console.error("Error fetching enriched items by IDs:", error);
    throw error;
  }
};

// ========== BACKWARD COMPATIBILITY (OLD ENDPOINTS) ==========

// Get items by product variant ID (uses old endpoint)
export const getItemsByProductVariantId = async (variantId) => {
  try {
    console.log("API - Getting items by variant ID:", variantId);
    const response = await axios.get(`${API_URL}/variant/${variantId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching items for variant ${variantId}:`, error);
    throw error;
  }
};

// Get items by price range (uses old endpoint)
export const getItemsByPriceRange = async (minPrice, maxPrice) => {
  try {
    console.log("API - Getting items by price range:", minPrice, "-", maxPrice);
    const response = await axios.get(`${API_URL}/price-range`, {
      params: { minPrice, maxPrice },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching items in price range:`, error);
    throw error;
  }
};

// ========== ADMIN/MANAGEMENT ENDPOINTS ==========

// Create new item
export const createItem = async (itemData) => {
  try {
    console.log("API - Creating new item:", itemData);
    const response = await axios.post(API_URL, itemData);
    return response.data;
  } catch (error) {
    console.error("Error creating item:", error);
    throw error;
  }
};

// Update item
export const updateItem = async (itemId, itemData) => {
  try {
    console.log("API - Updating item:", itemId, itemData);
    const response = await axios.put(`${API_URL}/${itemId}`, itemData);
    return response.data;
  } catch (error) {
    console.error(`Error updating item ${itemId}:`, error);
    throw error;
  }
};

// Update stock quantity
export const updateStock = async (itemId, quantity) => {
  try {
    console.log("API - Updating stock for item:", itemId, "to", quantity);
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
    console.log("API - Updating price for item:", itemId, "to", price);
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
    console.log("API - Updating discount for item:", itemId, "to", discount);
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
    console.log("API - Deleting item:", itemId);
    await axios.delete(`${API_URL}/${itemId}`);
    return true;
  } catch (error) {
    console.error(`Error deleting item ${itemId}:`, error);
    throw error;
  }
};

// ========== HELPER FUNCTIONS ==========

// Get available variants for a product in a specific store
export const getAvailableVariantsForProduct = async (
  productId,
  storeId = null
) => {
  try {
    console.log(
      "API - Getting available variants for product:",
      productId,
      "store:",
      storeId
    );

    // This will use the enriched data from getAllItems and filter
    const allItems = await getAllItems();
    const productItems = allItems.filter(
      (item) =>
        item.currentVariant &&
        item.currentVariant.productId === productId &&
        (storeId ? item.storeId === storeId : true) &&
        item.stock > 0
    );

    if (productItems.length > 0) {
      return productItems[0].availableVariants || [];
    }

    return [];
  } catch (error) {
    console.error(
      `Error fetching available variants for product ${productId}:`,
      error
    );
    throw error;
  }
};
export const getEnrichedItemByVariantId = async (variantId) => {
  const allItems = await getAllItems(); // optionally cache this
  return allItems.find((item) => item.productVariantId === variantId);
};
