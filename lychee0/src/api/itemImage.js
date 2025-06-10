import axios from "axios";

// BASE URL for item images
const BASE_URL = "http://localhost:8081/api/item-images";

// Fetch all item images
export const getAllItemImages = async () => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data;
  } catch (err) {
    console.error("Failed to fetch item images:", err);
    return [];
  }
};

// Get item image by ID
export const getItemImageById = async (imageId) => {
  try {
    const response = await axios.get(`${BASE_URL}/${imageId}`);
    return response.data;
  } catch (err) {
    console.error(`Failed to fetch item image ${imageId}:`, err);
    return null;
  }
};

// Get all images for a specific item
export const getItemImagesByItemId = async (itemId) => {
  try {
    const response = await axios.get(`${BASE_URL}/item/${itemId}`);
    return response.data;
  } catch (err) {
    console.error(`Failed to fetch images for item ${itemId}:`, err);
    return [];
  }
};

// Upload image file and create ItemImage record
export const uploadItemImage = async (file, itemId, caption = null) => {
  try {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("itemId", itemId);

    if (caption) {
      formData.append("caption", caption);
    }

    const response = await axios.post(`${BASE_URL}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (err) {
    console.error("Failed to upload item image:", err);
    throw err;
  }
};

// Create ItemImage record with existing image URL
export const createItemImage = async (itemImage) => {
  try {
    const response = await axios.post(BASE_URL, itemImage);
    return response.data;
  } catch (err) {
    console.error("Failed to create item image:", err);
    throw err;
  }
};

// Update ItemImage record
export const updateItemImage = async (imageId, itemImage) => {
  try {
    const response = await axios.put(`${BASE_URL}/${imageId}`, itemImage);
    return response.data;
  } catch (err) {
    console.error(`Failed to update item image ${imageId}:`, err);
    throw err;
  }
};

// Update only the caption of an item image
export const updateItemImageCaption = async (imageId, caption) => {
  try {
    const response = await axios.patch(`${BASE_URL}/${imageId}/caption`, {
      caption: caption,
    });
    return response.data;
  } catch (err) {
    console.error(`Failed to update caption for item image ${imageId}:`, err);
    throw err;
  }
};

// Replace existing image with new file
export const replaceItemImage = async (imageId, file, caption = null) => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    if (caption !== null) {
      formData.append("caption", caption);
    }

    const response = await axios.put(
      `${BASE_URL}/${imageId}/replace-image`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (err) {
    console.error(`Failed to replace item image ${imageId}:`, err);
    throw err;
  }
};

// Delete ItemImage record and associated S3 image
export const deleteItemImage = async (imageId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/${imageId}`);
    return response.data;
  } catch (err) {
    console.error(`Failed to delete item image ${imageId}:`, err);
    throw err;
  }
};

// Delete all images for a specific item
export const deleteItemImagesByItemId = async (itemId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/item/${itemId}`);
    return response.data;
  } catch (err) {
    console.error(`Failed to delete images for item ${itemId}:`, err);
    throw err;
  }
};

// ===================== UTILITY FUNCTIONS =====================

// Upload multiple images for an item
export const uploadMultipleItemImages = async (
  files,
  itemId,
  captions = []
) => {
  try {
    const uploadPromises = files.map((file, index) => {
      const caption = captions[index] || null;
      return uploadItemImage(file, itemId, caption);
    });

    const results = await Promise.allSettled(uploadPromises);

    const successful = results
      .filter((result) => result.status === "fulfilled")
      .map((result) => result.value);

    const failed = results
      .filter((result) => result.status === "rejected")
      .map((result) => result.reason);

    return {
      successful,
      failed,
      totalCount: files.length,
      successCount: successful.length,
      failureCount: failed.length,
    };
  } catch (err) {
    console.error("Failed to upload multiple images:", err);
    throw err;
  }
};

// Create item image with validation
export const createItemImageWithValidation = async (
  itemId,
  imageUrl,
  caption = null
) => {
  if (!itemId) {
    throw new Error("Item ID is required");
  }

  if (!imageUrl || !imageUrl.trim()) {
    throw new Error("Image URL is required");
  }

  const itemImage = {
    itemId: parseInt(itemId),
    imageUrl: imageUrl.trim(),
    caption: caption ? caption.trim() : null,
  };

  return await createItemImage(itemImage);
};

// Upload item image with validation
export const uploadItemImageWithValidation = async (
  file,
  itemId,
  caption = null
) => {
  if (!file) {
    throw new Error("Image file is required");
  }

  if (!itemId) {
    throw new Error("Item ID is required");
  }

  // Validate file type
  if (!file.type.startsWith("image/")) {
    throw new Error("File must be an image");
  }

  // Validate file size (5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error("File size must be less than 5MB");
  }

  const trimmedCaption = caption ? caption.trim() : null;

  return await uploadItemImage(file, parseInt(itemId), trimmedCaption);
};

// Update item image with validation
export const updateItemImageWithValidation = async (
  imageId,
  itemId,
  imageUrl,
  caption = null
) => {
  if (!imageId) {
    throw new Error("Image ID is required for update");
  }

  if (!itemId) {
    throw new Error("Item ID is required");
  }

  if (!imageUrl || !imageUrl.trim()) {
    throw new Error("Image URL is required");
  }

  const itemImage = {
    imageId: parseInt(imageId),
    itemId: parseInt(itemId),
    imageUrl: imageUrl.trim(),
    caption: caption ? caption.trim() : null,
  };

  return await updateItemImage(imageId, itemImage);
};

// Replace item image with validation
export const replaceItemImageWithValidation = async (
  imageId,
  file,
  caption = null
) => {
  if (!imageId) {
    throw new Error("Image ID is required");
  }

  if (!file) {
    throw new Error("New image file is required");
  }

  // Validate file type
  if (!file.type.startsWith("image/")) {
    throw new Error("File must be an image");
  }

  // Validate file size (5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error("File size must be less than 5MB");
  }

  const trimmedCaption = caption ? caption.trim() : null;

  return await replaceItemImage(parseInt(imageId), file, trimmedCaption);
};

// Update caption with validation
export const updateItemImageCaptionWithValidation = async (
  imageId,
  caption
) => {
  if (!imageId) {
    throw new Error("Image ID is required");
  }

  // Caption can be null or empty to remove it
  const trimmedCaption = caption ? caption.trim() : null;

  return await updateItemImageCaption(parseInt(imageId), trimmedCaption);
};

// Get item image count for a specific item
export const getItemImageCount = async (itemId) => {
  try {
    const images = await getItemImagesByItemId(itemId);
    return images.length;
  } catch (err) {
    console.error(`Failed to get image count for item ${itemId}:`, err);
    return 0;
  }
};

// Check if item has images
export const itemHasImages = async (itemId) => {
  try {
    const count = await getItemImageCount(itemId);
    return count > 0;
  } catch (err) {
    console.error(`Failed to check if item ${itemId} has images:`, err);
    return false;
  }
};

// Get first image for an item (useful for thumbnails)
export const getFirstItemImage = async (itemId) => {
  try {
    const images = await getItemImagesByItemId(itemId);
    return images.length > 0 ? images[0] : null;
  } catch (err) {
    console.error(`Failed to get first image for item ${itemId}:`, err);
    return null;
  }
};

// Reorder images by updating them with new item IDs or positions
// Note: This assumes you might want to implement ordering later
export const reorderItemImages = async (imageOrders) => {
  try {
    const updatePromises = imageOrders.map(({ imageId, newOrder }) => {
      // This would require backend support for ordering
      // For now, just return the current image
      return getItemImageById(imageId);
    });

    const results = await Promise.allSettled(updatePromises);

    return results
      .filter((result) => result.status === "fulfilled")
      .map((result) => result.value);
  } catch (err) {
    console.error("Failed to reorder images:", err);
    throw err;
  }
};

// Batch delete multiple images by their IDs
export const deleteMultipleItemImages = async (imageIds) => {
  try {
    const deletePromises = imageIds.map((imageId) => deleteItemImage(imageId));

    const results = await Promise.allSettled(deletePromises);

    const successful = results
      .filter((result) => result.status === "fulfilled")
      .map((result, index) => ({
        imageId: imageIds[index],
        result: result.value,
      }));

    const failed = results
      .filter((result) => result.status === "rejected")
      .map((result, index) => ({
        imageId: imageIds[index],
        error: result.reason,
      }));

    return {
      successful,
      failed,
      totalCount: imageIds.length,
      successCount: successful.length,
      failureCount: failed.length,
    };
  } catch (err) {
    console.error("Failed to delete multiple images:", err);
    throw err;
  }
};
