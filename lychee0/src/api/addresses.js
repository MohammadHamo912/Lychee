import axios from "axios";

// BASE URL for addresses
const BASE_URL = "http://localhost:8081/api/addresses";

// Fetch all addresses
export const getAllAddresses = async () => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data;
  } catch (err) {
    console.error("Failed to fetch addresses:", err);
    return [];
  }
};

// Get address by ID
export const getAddressById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
  } catch (err) {
    console.error(`Failed to fetch address ${id}:`, err);
    return null;
  }
};

// Create a new address
export const createAddress = async (address) => {
  try {
    const response = await axios.post(BASE_URL, address);
    return response.data;
  } catch (err) {
    console.error("Failed to create address:", err);
    throw err;
  }
};

// Update an existing address (using PUT without ID in URL)
export const updateAddress = async (address) => {
  try {
    const response = await axios.put(BASE_URL, address);
    return response.data;
  } catch (err) {
    console.error("Failed to update address:", err);
    throw err;
  }
};

// Update an existing address by ID (using PUT with ID in URL)
export const updateAddressById = async (id, address) => {
  try {
    const response = await axios.put(`${BASE_URL}/${id}`, address);
    return response.data;
  } catch (err) {
    console.error(`Failed to update address ${id}:`, err);
    throw err;
  }
};

// Delete an address by ID
export const deleteAddress = async (id) => {
  try {
    await axios.delete(`${BASE_URL}/${id}`);
    return true;
  } catch (err) {
    console.error(`Failed to delete address ${id}:`, err);
    throw err;
  }
};

// Example usage functions for common address operations

// Create address with validation
export const createAddressWithValidation = async (city, street, building) => {
  if (!city || !street || !building) {
    throw new Error("All address fields (city, street, building) are required");
  }

  const address = {
    city: city.trim(),
    street: street.trim(),
    building: building.trim(),
  };

  return await createAddress(address);
};

// Update address with validation
export const updateAddressWithValidation = async (
  addressId,
  city,
  street,
  building
) => {
  if (!addressId) {
    throw new Error("Address ID is required for update");
  }

  if (!city || !street || !building) {
    throw new Error("All address fields (city, street, building) are required");
  }

  const address = {
    addressId: addressId,
    city: city.trim(),
    street: street.trim(),
    building: building.trim(),
  };

  return await updateAddress(address);
};
