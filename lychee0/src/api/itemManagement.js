// API functions for Item Management

const API_BASE_URL = "http://localhost:8081/api";

// Item Management endpoints
export const createCompleteItem = async (itemData) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/item-management/create-item`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itemData),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating item:", error);
    throw error;
  }
};

export const checkProductByBarcode = async (barcode) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/item-management/check-product?barcode=${encodeURIComponent(
        barcode
      )}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error checking product:", error);
    throw error;
  }
};

export const checkVariant = async (productId, size, color) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/item-management/check-variant?productId=${productId}&size=${encodeURIComponent(
        size
      )}&color=${encodeURIComponent(color)}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error checking variant:", error);
    throw error;
  }
};

export const getMainCategories = async () => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/item-management/main-categories`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching main categories:", error);
    throw error;
  }
};

export const getSubcategories = async (parentId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/item-management/categories/${parentId}/subcategories`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    throw error;
  }
};

// Enriched Items endpoints
export const getItemsByStoreId = async (storeId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/items/enriched/store/${storeId}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching store items:", error);
    throw error;
  }
};

export const getEnrichedItemById = async (itemId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/items/enriched/${itemId}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching item:", error);
    throw error;
  }
};

export const updateItem = async (itemId, itemData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/items/${itemId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(itemData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating item:", error);
    throw error;
  }
};

export const deleteItem = async (itemId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/items/${itemId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error("Error deleting item:", error);
    throw error;
  }
};

export const updateItemStock = async (itemId, quantity) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/items/${itemId}/stock?quantity=${quantity}`,
      {
        method: "PATCH",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error("Error updating stock:", error);
    throw error;
  }
};

export const updateItemPrice = async (itemId, price) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/items/${itemId}/price?price=${price}`,
      {
        method: "PATCH",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error("Error updating price:", error);
    throw error;
  }
};

export const updateItemDiscount = async (itemId, discount) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/items/${itemId}/discount?discount=${discount}`,
      {
        method: "PATCH",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error("Error updating discount:", error);
    throw error;
  }
};

// Image upload
export const uploadImage = async (file, type = "ProductsImages") => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(`${API_BASE_URL}/images/upload/${type}`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

// Search and filter functions
export const searchItemsInStore = async (storeId, query) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/items/enriched/store/${storeId}/search?query=${encodeURIComponent(
        query
      )}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error searching items:", error);
    throw error;
  }
};

// Category management
export const createCategory = async (categoryData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(categoryData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

// Validation helpers
export const validateBarcode = (barcode) => {
  // Basic barcode validation - adjust according to your needs
  const barcodeRegex = /^[0-9]{8,14}$/;
  return barcodeRegex.test(barcode);
};

export const validatePrice = (price) => {
  const numPrice = parseFloat(price);
  return !isNaN(numPrice) && numPrice > 0;
};

export const validateStock = (stock) => {
  const numStock = parseInt(stock);
  return !isNaN(numStock) && numStock >= 0;
};

export const validateDiscount = (discount) => {
  const numDiscount = parseFloat(discount);
  return !isNaN(numDiscount) && numDiscount >= 0 && numDiscount <= 100;
};
