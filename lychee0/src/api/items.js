import axios from "axios";

const API_URL = "http://localhost:8081/api/items";
const PRODUCTS_API_URL = "http://localhost:8081/api/products";
const VARIANTS_API_URL = "http://localhost:8081/api/productvariants";

let allItems = []; // Cache for all items

// Optimized function to get products by IDs using batch endpoint
const getProductsByIds = async (productIds) => {
  if (!productIds || productIds.length === 0) return [];

  try {
    const uniqueIds = [...new Set(productIds)]; // Remove duplicates
    const response = await axios.post(`${PRODUCTS_API_URL}/batch`, uniqueIds);
    return response.data;
  } catch (error) {
    console.error("Error fetching products by IDs:", error);
    return [];
  }
};

// Optimized function to get product variants by IDs using batch endpoint
const getProductVariantsByIds = async (variantIds) => {
  if (!variantIds || variantIds.length === 0) return [];

  try {
    const uniqueIds = [...new Set(variantIds)]; // Remove duplicates
    const response = await axios.post(
      `${VARIANTS_API_URL}/batch-load`,
      uniqueIds
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching product variants by IDs:", error);
    return [];
  }
};

// Function to get all product variants for a specific product (for available variants)
const getProductVariantsByProductId = async (productId) => {
  try {
    const response = await axios.get(
      `${VARIANTS_API_URL}/product/${productId}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching variants for product ${productId}:`, error);
    return [];
  }
};

// Helper function to ensure allItems cache is loaded
const ensureAllItemsLoaded = async () => {
  if (allItems.length === 0) {
    try {
      const response = await axios.get(API_URL);
      allItems = response.data;
      console.log("Loaded all items cache:", allItems.length, "items");
    } catch (error) {
      console.error("Error loading all items cache:", error);
      allItems = [];
    }
  }
};

// Optimized enrichItemData that loads only needed data
const enrichItemData = async (items) => {
  if (!items || items.length === 0) return [];

  console.log("Raw items data:", items);

  // Ensure allItems cache is loaded for variant availability checks
  await ensureAllItemsLoaded();

  // Extract unique variant IDs from items
  const variantIds = [
    ...new Set(items.map((item) => item.productVariantId).filter(Boolean)),
  ];

  // Load only needed variants
  const productVariants = await getProductVariantsByIds(variantIds);
  console.log("Loaded Product Variants:", productVariants);

  // Extract unique product IDs from variants
  const productIds = [
    ...new Set(
      productVariants.map((variant) => variant.productId).filter(Boolean)
    ),
  ];

  // Load only needed products
  const products = await getProductsByIds(productIds);
  console.log("Loaded Products:", products);

  // For available variants, we need to get ALL variants for each product
  // Get unique product IDs and fetch all their variants
  const allVariantsForProducts = [];
  for (const productId of productIds) {
    const variants = await getProductVariantsByProductId(productId);
    allVariantsForProducts.push(...variants);
  }

  // Create lookup maps for better performance
  const variantsMap = productVariants.reduce((map, variant) => {
    map[variant.productVariantId] = variant;
    return map;
  }, {});

  const productsMap = products.reduce((map, product) => {
    map[product.productId] = product;
    return map;
  }, {});

  // Group ALL variants by productId for available variants lookup
  const variantsByProduct = allVariantsForProducts.reduce((map, variant) => {
    if (!map[variant.productId]) {
      map[variant.productId] = [];
    }
    map[variant.productId].push(variant);
    return map;
  }, {});

  console.log("Variants Map:", variantsMap);
  console.log("Products Map:", productsMap);

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
      description: product?.description || "No description available",
      brand: product?.brand || "Unknown Brand",
      image: product?.logo_url || variant?.image || "/images/default.jpg",
      price: parseFloat(item.price),
      discount: parseFloat(item.discount),
      stock: item.stockQuantity,
      barcode: product?.barcode || "",
      // Current variant information
      currentVariant: variant
        ? {
            id: variant.productVariantId,
            size: variant.size,
            color: variant.color,
            productId: variant.productId,
          }
        : null,
      // All available variants for this product
      availableVariants: availableVariants.map((v) => ({
        id: v.productVariantId,
        size: v.size,
        color: v.color,
        productId: v.productId,
        // Check if this variant is available as an item in any store
        available: allItems.some(
          (i) =>
            i.productVariantId === v.productVariantId &&
            i.stockQuantity > 0 &&
            !i.deletedAt
        ),
        // Check if available in the same store as current item
        availableInSameStore: allItems.some(
          (i) =>
            i.productVariantId === v.productVariantId &&
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

// NEW FUNCTION: Get trending items (top 5 most sold in last month)
export const getTrendingItems = async () => {
  try {
    const response = await axios.get(`${API_URL}/trending`);
    return enrichItemData(response.data);
  } catch (error) {
    console.error("Error fetching trending items:", error);
    throw error;
  }
};

// Get all items
export const getAllItems = async () => {
  try {
    const response = await axios.get(API_URL);
    allItems = response.data; // Cache all items for variant availability check
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
    return (await enrichItemData([response.data]))[0];
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

// Get available variants for a product in a specific store
export const getAvailableVariantsForProduct = async (
  productId,
  storeId = null
) => {
  try {
    await ensureAllItemsLoaded();
    const allItemsData = await getAllItems();

    // Get all variants for this specific product
    const productVariantsForProduct = await getProductVariantsByProductId(
      productId
    );

    return productVariantsForProduct.map((variant) => {
      const itemsForVariant = allItemsData.filter(
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

// Create new item
export const createItem = async (itemData) => {
  try {
    const response = await axios.post(API_URL, itemData);
    // Refresh cache
    allItems = [];
    return (await enrichItemData([response.data]))[0];
  } catch (error) {
    console.error("Error creating item:", error);
    throw error;
  }
};

// Update item
export const updateItem = async (itemId, itemData) => {
  try {
    const response = await axios.put(`${API_URL}/${itemId}`, itemData);
    // Refresh cache
    allItems = [];
    return (await enrichItemData([response.data]))[0];
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
    // Refresh cache
    allItems = [];
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
    // Refresh cache
    allItems = [];
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
    // Refresh cache
    allItems = [];
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
    // Refresh cache
    allItems = [];
    return true;
  } catch (error) {
    console.error(`Error deleting item ${itemId}:`, error);
    throw error;
  }
};

// Clear cache (useful for testing or manual refresh)
export const clearCache = () => {
  allItems = [];
};
