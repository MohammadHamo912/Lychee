import axios from "axios";

// BASE URL for product categories
const BASE_URL = "http://localhost:8081/api/productcategories";

// Fetch all product categories
export const getAllProductCategories = async () => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data;
  } catch (err) {
    console.error("Failed to fetch product categories:", err);
    return [];
  }
};

// Get categories by product ID
export const getCategoriesByProductId = async (productId) => {
  try {
    const response = await axios.get(`${BASE_URL}/product/${productId}`);
    return response.data;
  } catch (err) {
    console.error(`Failed to fetch categories for product ${productId}:`, err);
    return [];
  }
};

// Get products by category ID
export const getProductsByCategoryId = async (categoryId) => {
  try {
    const response = await axios.get(`${BASE_URL}/category/${categoryId}`);
    return response.data;
  } catch (err) {
    console.error(`Failed to fetch products for category ${categoryId}:`, err);
    return [];
  }
};

// Create a new product-category relationship
export const createProductCategory = async (productCategory) => {
  try {
    const response = await axios.post(BASE_URL, productCategory);
    return response.data;
  } catch (err) {
    console.error("Failed to create product category:", err);
    throw err;
  }
};

// Delete a product-category relationship
export const deleteProductCategory = async (productId, categoryId) => {
  try {
    await axios.delete(
      `${BASE_URL}/product/${productId}/category/${categoryId}`
    );
    return true;
  } catch (err) {
    console.error(
      `Failed to delete product category relationship (${productId}, ${categoryId}):`,
      err
    );
    throw err;
  }
};

// Add multiple categories to a product
export const addCategoriesToProduct = async (productId, categoryIds) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/product/${productId}/categories`,
      categoryIds
    );
    return response.data;
  } catch (err) {
    console.error(`Failed to add categories to product ${productId}:`, err);
    throw err;
  }
};

// Add multiple products to a category
export const addProductsToCategory = async (categoryId, productIds) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/category/${categoryId}/products`,
      productIds
    );
    return response.data;
  } catch (err) {
    console.error(`Failed to add products to category ${categoryId}:`, err);
    throw err;
  }
};

// Remove all categories from a product
export const removeAllCategoriesFromProduct = async (productId) => {
  try {
    const categories = await getCategoriesByProductId(productId);
    const deletePromises = categories.map((pc) =>
      deleteProductCategory(pc.productId, pc.categoryId)
    );
    await Promise.all(deletePromises);
    return true;
  } catch (err) {
    console.error(
      `Failed to remove all categories from product ${productId}:`,
      err
    );
    throw err;
  }
};

// Remove all products from a category
export const removeAllProductsFromCategory = async (categoryId) => {
  try {
    const products = await getProductsByCategoryId(categoryId);
    const deletePromises = products.map((pc) =>
      deleteProductCategory(pc.productId, pc.categoryId)
    );
    await Promise.all(deletePromises);
    return true;
  } catch (err) {
    console.error(
      `Failed to remove all products from category ${categoryId}:`,
      err
    );
    throw err;
  }
};
