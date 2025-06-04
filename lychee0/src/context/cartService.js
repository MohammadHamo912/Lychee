import ShoppingCartAPI from "../api/shoppingcartitems";

const CartService = {
  async addToCart(userId, itemId, quantity) {
    try {
      console.log("CartService - Adding to cart:", {
        userId,
        itemId,
        quantity,
      });

      // Validate inputs
      if (!userId || !itemId || !quantity) {
        throw new Error(
          "CartService - Missing required parameters: userId, itemId, or quantity"
        );
      }

      await ShoppingCartAPI.addToCart(userId, itemId, quantity);
      console.log("CartService - Item added to cart successfully!");
    } catch (error) {
      console.error("CartService - Failed to add item to cart:", error);
      throw error; // Let the caller handle the error
    }
  },
};

export default CartService;
