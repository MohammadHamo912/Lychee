import axios from "axios";

// BASE URL for categories
const BASE_URL = "http://localhost:8081/api/categories";

// Fetch all categories
export const getAllCategories = async () => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data;
  } catch (err) {
    console.error("Failed to fetch categories:", err);
    return [];
  }
};

// Get category by ID
export const getCategoryById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
  } catch (err) {
    console.error(`Failed to fetch category ${id}:`, err);
    return null;
  }
};

// Get subcategories by parent ID
export const getSubcategories = async (parentId) => {
  try {
    const response = await axios.get(`${BASE_URL}/${parentId}/subcategories`);
    return response.data;
  } catch (err) {
    console.error(`Failed to fetch subcategories for parent ${parentId}:`, err);
    return [];
  }
};

// Create a new category
export const createCategory = async (category) => {
  try {
    const response = await axios.post(BASE_URL, category);
    return response.data;
  } catch (err) {
    console.error("Failed to create category:", err);
    throw err;
  }
};

// Update an existing category
export const updateCategory = async (id, category) => {
  try {
    const response = await axios.put(`${BASE_URL}/${id}`, category);
    return response.data;
  } catch (err) {
    console.error(`Failed to update category ${id}:`, err);
    throw err;
  }
};

// Delete a category by ID
export const deleteCategory = async (id) => {
  try {
    await axios.delete(`${BASE_URL}/${id}`);
    return true;
  } catch (err) {
    console.error(`Failed to delete category ${id}:`, err);
    throw err;
  }
};
