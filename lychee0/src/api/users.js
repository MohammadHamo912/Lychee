import axios from "axios";

const API_URL = "http://localhost:8081/api/users";

// Get all users
export const getAllUsers = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// Get user by ID
export const getUserById = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user ${userId}:`, error);
    throw error;
  }
};

// Create new user
export const createUser = async (userData) => {
  try {
    // Make sure password is properly set if it's not already
    if (!userData.passwordHash) {
      userData.passwordHash = userData.password || "tempPassword123";
    }

    const response = await axios.post(API_URL, userData);
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

// Update user
export const updateUser = async (userId, userData) => {
  try {
    const response = await axios.put(`${API_URL}/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error(`Error updating user ${userId}:`, error);
    throw error;
  }
};

// Delete user (soft delete)
export const deleteUser = async (userId) => {
  try {
    await axios.delete(`${API_URL}/${userId}`);
    return true;
  } catch (error) {
    console.error(`Error deleting user ${userId}:`, error);
    throw error;
  }
};

// Set user active status
export const setUserActiveStatus = async (userId, isActive) => {
  try {
    const response = await axios.put(`${API_URL}/${userId}/active/${isActive}`);
    return response.data;
  } catch (error) {
    console.error(`Error setting active status for user ${userId}:`, error);
    throw error;
  }
};
