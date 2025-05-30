import axios from "axios";

import { getAllProductVariants } from "./productvariant";
import { getAllProducts } from "./products";

const API_URL = "http://localhost:8081/api/items";
let productVariants = [];
let products = [];
<<<<<<< HEAD
=======
let allItems = []; // Cache for all items
>>>>>>> d1474035a0413c9afbf4e465f915032571632aad

const loadDependencies = async () => {
  if (productVariants.length === 0) {
    productVariants = await getAllProductVariants();
<<<<<<< HEAD
  }
  if (products.length === 0) {
    products = await getAllProducts();
=======
    console.log("Loaded Product Variants:", productVariants);
  }
  if (products.length === 0) {
    products = await getAllProducts();
    console.log("Loaded Products:", products);
>>>>>>> d1474035a0413c9afbf4e465f915032571632aad
  }
};

const enrichItemData = async (items) => {
  await loadDependencies();
<<<<<<< HEAD
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
=======

  console.log("Raw items data:", items);

  // Create lookup maps for better performance - using correct field names
  const variantsMap = productVariants.reduce((map, variant) => {
    map[variant.productVariantId] = variant; // Use productVariantId, not id
    return map;
  }, {});

  const productsMap = products.reduce((map, product) => {
    map[product.productId] = product; // Use productId, not id
    return map;
  }, {});

  console.log("Variants Map:", variantsMap);
  console.log("Products Map:", productsMap);

  // Group variants by productId for available variants lookup
  const variantsByProduct = productVariants.reduce((map, variant) => {
    if (!map[variant.productId]) {
      map[variant.productId] = [];
    }
    map[variant.productId].push(variant);
    return map;
  }, {});

  const enrichedItems = items.map((item) => {
    console.log(
      `Processing item ${item.itemId} with productVariantId: ${item.productVariantId}`
    );

    const variant = variantsMap[item.productVariantId];
    console.log(`Found variant:`, variant);

    const product = variant ? productsMap[variant.productId] : null;
    console.log(`Found product:`, product);

    const availableVariants = variant
      ? variantsByProduct[variant.productId] || []
      : [];

    const enrichedItem = {
      ...item,
      id: item.itemId, // Add id field for compatibility
      name: product?.name || `Product ${item.productVariantId}`,
      category: product?.category || "Uncategorized",
      description: product?.description || "No description available",
      image: product?.logo_url || variant?.image || "/images/default.jpg", // Use product logo_url first
      price: parseFloat(item.price),
      discount: parseFloat(item.discount),
      stock: item.stockQuantity,
      barcode: product?.barcode || "",
      // Current variant information
      currentVariant: variant
        ? {
            id: variant.productVariantId, // Use productVariantId
            size: variant.size,
            color: variant.color,
            productId: variant.productId,
          }
        : null,
      // All available variants for this product
      availableVariants: availableVariants.map((v) => ({
        id: v.productVariantId, // Use productVariantId
        size: v.size,
        color: v.color,
        productId: v.productId,
        // Check if this variant is available as an item in any store
        available: allItems.some(
          (i) =>
            i.productVariantId === v.productVariantId && // Use productVariantId
            i.stockQuantity > 0 &&
            !i.deletedAt
        ),
        // Check if available in the same store as current item
        availableInSameStore: allItems.some(
          (i) =>
            i.productVariantId === v.productVariantId && // Use productVariantId
            i.storeId === item.storeId &&
            i.stockQuantity > 0 &&
            !i.deletedAt
        ),
      })),
    };

    console.log(`Enriched item:`, enrichedItem);
    return enrichedItem;
  });

  console.log("Final enriched items:", enrichedItems);
  return enrichedItems;
};

>>>>>>> d1474035a0413c9afbf4e465f915032571632aad
// Get all items
export const getAllItems = async () => {
  try {
    const response = await axios.get(API_URL);
<<<<<<< HEAD
=======
    allItems = response.data; // Cache all items for variant availability check
>>>>>>> d1474035a0413c9afbf4e465f915032571632aad
    return enrichItemData(response.data);
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
};

<<<<<<< HEAD
=======
// Rest of your functions remain the same...
>>>>>>> d1474035a0413c9afbf4e465f915032571632aad
// Get item by ID
export const getItemById = async (itemId) => {
  try {
    const response = await axios.get(`${API_URL}/${itemId}`);
<<<<<<< HEAD
    return enrichItemData([response.data])[0];
=======
    // Load all items if not cached for variant availability check
    if (allItems.length === 0) {
      const allItemsResponse = await axios.get(API_URL);
      allItems = allItemsResponse.data;
    }
    return (await enrichItemData([response.data]))[0];
>>>>>>> d1474035a0413c9afbf4e465f915032571632aad
  } catch (error) {
    console.error(`Error fetching item ${itemId}:`, error);
    throw error;
  }
};

// Get items by store ID
export const getItemsByStoreId = async (storeId) => {
  try {
    const response = await axios.get(`${API_URL}/store/${storeId}`);
<<<<<<< HEAD
=======
    // Load all items for variant availability check
    if (allItems.length === 0) {
      const allItemsResponse = await axios.get(API_URL);
      allItems = allItemsResponse.data;
    }
>>>>>>> d1474035a0413c9afbf4e465f915032571632aad
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
<<<<<<< HEAD
=======
    // Load all items for variant availability check
    if (allItems.length === 0) {
      const allItemsResponse = await axios.get(API_URL);
      allItems = allItemsResponse.data;
    }
>>>>>>> d1474035a0413c9afbf4e465f915032571632aad
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
<<<<<<< HEAD
=======
    // Load all items for variant availability check
    if (allItems.length === 0) {
      const allItemsResponse = await axios.get(API_URL);
      allItems = allItemsResponse.data;
    }
>>>>>>> d1474035a0413c9afbf4e465f915032571632aad
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
<<<<<<< HEAD
=======
    // Load all items for variant availability check
    if (allItems.length === 0) {
      const allItemsResponse = await axios.get(API_URL);
      allItems = allItemsResponse.data;
    }
>>>>>>> d1474035a0413c9afbf4e465f915032571632aad
    return enrichItemData(response.data);
  } catch (error) {
    console.error(`Error searching items by name ${productName}:`, error);
    throw error;
  }
};

<<<<<<< HEAD
=======
// Get items by category (filter enriched items by product category)
export const getItemsByCategory = async (category) => {
  try {
    const allItems = await getAllItems();
    return allItems.filter((item) => item.category === category);
  } catch (error) {
    console.error(`Error fetching items by category ${category}:`, error);
    throw error;
  }
};

// Get available variants for a product in a specific store
export const getAvailableVariantsForProduct = async (
  productId,
  storeId = null
) => {
  try {
    await loadDependencies();
    const allItems = await getAllItems();

    const productVariantsForProduct = productVariants.filter(
      (v) => v.productId === productId
    );

    return productVariantsForProduct.map((variant) => {
      const itemsForVariant = allItems.filter(
        (item) =>
          item.currentVariant?.id === variant.productVariantId &&
          (storeId ? item.storeId === storeId : true) &&
          item.stock > 0
      );

      return {
        ...variant,
        available: itemsForVariant.length > 0,
        items: itemsForVariant,
        totalStock: itemsForVariant.reduce((sum, item) => sum + item.stock, 0),
      };
    });
  } catch (error) {
    console.error(
      `Error fetching available variants for product ${productId}:`,
      error
    );
    throw error;
  }
};

>>>>>>> d1474035a0413c9afbf4e465f915032571632aad
// Create new item
export const createItem = async (itemData) => {
  try {
    const response = await axios.post(API_URL, itemData);
<<<<<<< HEAD
    return enrichItemData([response.data])[0];
=======
    // Refresh cache
    allItems = [];
    return (await enrichItemData([response.data]))[0];
>>>>>>> d1474035a0413c9afbf4e465f915032571632aad
  } catch (error) {
    console.error("Error creating item:", error);
    throw error;
  }
};

// Update item
export const updateItem = async (itemId, itemData) => {
  try {
    const response = await axios.put(`${API_URL}/${itemId}`, itemData);
<<<<<<< HEAD
    return enrichItemData([response.data])[0];
=======
    // Refresh cache
    allItems = [];
    return (await enrichItemData([response.data]))[0];
>>>>>>> d1474035a0413c9afbf4e465f915032571632aad
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
<<<<<<< HEAD
=======
    // Refresh cache
    allItems = [];
>>>>>>> d1474035a0413c9afbf4e465f915032571632aad
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
<<<<<<< HEAD
=======
    // Refresh cache
    allItems = [];
>>>>>>> d1474035a0413c9afbf4e465f915032571632aad
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
<<<<<<< HEAD
=======
    // Refresh cache
    allItems = [];
>>>>>>> d1474035a0413c9afbf4e465f915032571632aad
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
<<<<<<< HEAD
=======
    // Refresh cache
    allItems = [];
>>>>>>> d1474035a0413c9afbf4e465f915032571632aad
    return true;
  } catch (error) {
    console.error(`Error deleting item ${itemId}:`, error);
    throw error;
  }
};
<<<<<<< HEAD
=======

// Clear cache (useful for testing or manual refresh)
export const clearCache = () => {
  allItems = [];
  productVariants = [];
  products = [];
};
>>>>>>> d1474035a0413c9afbf4e465f915032571632aad
