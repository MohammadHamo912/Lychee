// shoppingcartitems.js
const API_BASE_URL = "http://localhost:8081";

class ShoppingCartAPI {
  static async getCartItems(userId) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/cart/${userId}`);
      if (!res.ok) throw new Error(`Failed to fetch cart: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error("[getCartItems]", err);
      return [];
    }
  }

  static async getCartItem(userId, itemId) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/cart/${userId}/${itemId}`);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error(`Failed to fetch item: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error("[getCartItem]", err);
      return null;
    }
  }

  static async addToCart(userId, itemId, quantity = 1) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, itemId, quantity }),
      });

      if (!res.ok) throw new Error(`Add to cart failed: ${res.status}`);
      return await res.json().catch(() => ({ userId, itemId, quantity }));
    } catch (err) {
      console.error("[addToCart]", err);
      throw err;
    }
  }

  static async updateCartItemQuantity(userId, itemId, quantity) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/cart/${userId}/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });

      if (!res.ok) throw new Error(`Update failed: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error("[updateCartItemQuantity]", err);
      throw err;
    }
  }

  static async removeFromCart(userId, itemId) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/cart/${userId}/${itemId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`Remove failed: ${res.status}`);
      return true;
    } catch (err) {
      console.error("[removeFromCart]", err);
      throw err;
    }
  }

  static async clearCart(userId) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/cart/${userId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`Clear failed: ${res.status}`);
      return true;
    } catch (err) {
      console.error("[clearCart]", err);
      throw err;
    }
  }

  static getCartSummary(cartItems) {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    return { totalItems, totalPrice, itemCount: cartItems.length };
  }

  static async isItemInCart(userId, itemId) {
    try {
      const item = await this.getCartItem(userId, itemId);
      return item !== null;
    } catch (err) {
      console.error("[isItemInCart]", err);
      return false;
    }
  }

  static async batchUpdateCart(userId, updates) {
    try {
      const results = await Promise.all(
        updates.map(({ itemId, quantity }) =>
          this.updateCartItemQuantity(userId, itemId, quantity)
        )
      );
      return results;
    } catch (err) {
      console.error("[batchUpdateCart]", err);
      throw err;
    }
  }
}

export default ShoppingCartAPI;
