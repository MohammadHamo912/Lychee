// API endpoints for shopping cart operations
const API_BASE_URL = "http://localhost:8081";

class ShoppingCartAPI {
  /**
   * Get all cart items for a specific user
   * @param {number} userId - The user ID
   * @returns {Promise<Array>} Array of cart items
   */
  static async getCartItems(userId) {
    try {
      console.log(`ShoppingCartAPI - Getting cart items for user: ${userId}`);
      const response = await fetch(`${API_BASE_URL}/api/cart/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(
        `ShoppingCartAPI - Get cart items response status: ${response.status}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(
        `ShoppingCartAPI - Retrieved ${data.length} cart items:`,
        data
      );
      return data;
    } catch (error) {
      console.error("ShoppingCartAPI - Error fetching cart items:", error);
      throw error;
    }
  }

  /**
   * Get a specific cart item for a user
   * @param {number} userId - The user ID
   * @param {number} itemId - The item ID
   * @returns {Promise<Object>} Cart item object
   */
  static async getCartItem(userId, itemId) {
    try {
      console.log(
        `ShoppingCartAPI - Getting cart item for user: ${userId}, item: ${itemId}`
      );
      const response = await fetch(
        `${API_BASE_URL}/api/cart/${userId}/${itemId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(
        `ShoppingCartAPI - Get cart item response status: ${response.status}`
      );

      if (response.status === 404) {
        console.log("ShoppingCartAPI - Cart item not found");
        return null; // Item not found
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("ShoppingCartAPI - Retrieved cart item:", data);
      return data;
    } catch (error) {
      console.error("ShoppingCartAPI - Error fetching cart item:", error);
      throw error;
    }
  }

  /**
   * Add an item to the cart
   * @param {number} userId - The user ID
   * @param {number} itemId - The item ID
   * @param {number} quantity - The quantity to add
   * @returns {Promise<Object>} Added cart item
   */
  static async addToCart(userId, itemId, quantity = 1) {
    try {
      const requestData = {
        userId: userId,
        itemId: itemId,
        quantity: quantity,
      };

      console.log("ShoppingCartAPI - Adding to cart with data:", requestData);
      console.log("ShoppingCartAPI - Request URL:", `${API_BASE_URL}/api/cart`);

      const response = await fetch(`${API_BASE_URL}/api/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      console.log(
        `ShoppingCartAPI - Add to cart response status: ${response.status}`
      );
      console.log(
        "ShoppingCartAPI - Response headers:",
        Object.fromEntries(response.headers)
      );

      // Log response text for debugging
      const responseText = await response.text();
      console.log("ShoppingCartAPI - Response text:", responseText);

      if (!response.ok) {
        console.error(
          `ShoppingCartAPI - HTTP error! status: ${response.status}, response: ${responseText}`
        );
        throw new Error(
          `HTTP error! status: ${response.status}, response: ${responseText}`
        );
      }

      // Try to parse JSON
      let data;
      try {
        data = JSON.parse(responseText);
        console.log("ShoppingCartAPI - Successfully added to cart:", data);
      } catch (parseError) {
        console.error(
          "ShoppingCartAPI - Failed to parse response as JSON:",
          parseError
        );
        // If response is empty but status is success, return the request data
        if (response.status === 201 || response.status === 200) {
          console.log("ShoppingCartAPI - Assuming success with empty response");
          return requestData;
        }
        throw parseError;
      }

      return data;
    } catch (error) {
      console.error("ShoppingCartAPI - Error adding item to cart:", error);
      throw error;
    }
  }

  static async updateCartItemQuantity(userId, itemId, quantity) {
    try {
      const requestData = { quantity: quantity };
      console.log(
        `ShoppingCartAPI - Updating cart item quantity for user: ${userId}, item: ${itemId}, quantity: ${quantity}`
      );

      const response = await fetch(
        `${API_BASE_URL}/api/cart/${userId}/${itemId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      console.log(
        `ShoppingCartAPI - Update cart item response status: ${response.status}`
      );

      if (response.status === 404) {
        throw new Error("Cart item not found");
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("ShoppingCartAPI - Successfully updated cart item:", data);
      return data;
    } catch (error) {
      console.error(
        "ShoppingCartAPI - Error updating cart item quantity:",
        error
      );
      throw error;
    }
  }

  /**
   * Remove a specific item from the cart
   * @param {number} userId - The user ID
   * @param {number} itemId - The item ID
   * @returns {Promise<boolean>} Success status
   */
  static async removeFromCart(userId, itemId) {
    try {
      console.log(
        `ShoppingCartAPI - Removing from cart - user: ${userId}, item: ${itemId}`
      );

      const response = await fetch(
        `${API_BASE_URL}/api/cart/${userId}/${itemId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(
        `ShoppingCartAPI - Remove from cart response status: ${response.status}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log("ShoppingCartAPI - Successfully removed from cart");
      return true;
    } catch (error) {
      console.error("ShoppingCartAPI - Error removing item from cart:", error);
      throw error;
    }
  }

  /**
   * Clear all items from a user's cart
   * @param {number} userId - The user ID
   * @returns {Promise<boolean>} Success status
   */
  static async clearCart(userId) {
    try {
      console.log(`ShoppingCartAPI - Clearing cart for user: ${userId}`);

      const response = await fetch(`${API_BASE_URL}/api/cart/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(
        `ShoppingCartAPI - Clear cart response status: ${response.status}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log("ShoppingCartAPI - Successfully cleared cart");
      return true;
    } catch (error) {
      console.error("ShoppingCartAPI - Error clearing cart:", error);
      throw error;
    }
  }

  /**
   * Get cart summary (total items, total price, etc.)
   * This is a utility method that processes cart items on the frontend
   * @param {Array} cartItems - Array of cart items
   * @returns {Object} Cart summary
   */
  static getCartSummary(cartItems) {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    return {
      totalItems,
      totalPrice,
      itemCount: cartItems.length,
    };
  }

  /**
   * Batch update multiple cart items
   * @param {number} userId - The user ID
   * @param {Array} updates - Array of {itemId, quantity} objects
   * @returns {Promise<Array>} Array of updated cart items
   */
  static async batchUpdateCart(userId, updates) {
    try {
      console.log(
        `ShoppingCartAPI - Batch updating cart for user: ${userId}`,
        updates
      );

      const updatePromises = updates.map((update) =>
        this.updateCartItemQuantity(userId, update.itemId, update.quantity)
      );

      const results = await Promise.all(updatePromises);
      console.log("ShoppingCartAPI - Batch update completed:", results);
      return results;
    } catch (error) {
      console.error("ShoppingCartAPI - Error batch updating cart:", error);
      throw error;
    }
  }

  /**
   * Check if an item exists in the cart
   * @param {number} userId - The user ID
   * @param {number} itemId - The item ID
   * @returns {Promise<boolean>} Whether item exists in cart
   */
  static async isItemInCart(userId, itemId) {
    try {
      const item = await this.getCartItem(userId, itemId);
      const exists = item !== null;
      console.log(
        `ShoppingCartAPI - Item ${itemId} exists in cart for user ${userId}: ${exists}`
      );
      return exists;
    } catch (error) {
      console.error(
        "ShoppingCartAPI - Error checking if item is in cart:",
        error
      );
      return false;
    }
  }
}

export default ShoppingCartAPI;
