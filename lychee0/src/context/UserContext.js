// src/context/UserContext.js
import React, { useState, useContext, createContext, useEffect } from "react";
import ShoppingCartAPI from "../api/shoppingcartitems"; // Update this path

// Create the context
const UserContext = createContext();

// Custom hook to use the UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isLoadingCart, setIsLoadingCart] = useState(false);

  // Load cart items when component mounts or user changes
  useEffect(() => {
    if (user) {
      loadCartItems();
    } else {
      setCart([]);
      setCartCount(0);
    }
  }, [user]);

  // Update cart count whenever cart items change
  useEffect(() => {
    const totalCount = cart.reduce(
      (sum, item) => sum + (item.quantity || 0),
      0
    );
    setCartCount(totalCount);
  }, [cart]);

  const loadCartItems = async () => {
    if (!user) return;

    try {
      setIsLoadingCart(true);
      const userIdToUse = user.user_id;
      console.log("UserContext - Loading cart for user:", userIdToUse);

      const cartItems = await ShoppingCartAPI.getCartItems(userIdToUse);
      setCart(cartItems || []);
      console.log("UserContext - Loaded cart items:", cartItems);
    } catch (error) {
      console.error("UserContext - Error loading cart items:", error);
      setCart([]);
    } finally {
      setIsLoadingCart(false);
    }
  };

  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    // Cart will be loaded automatically by useEffect
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setCart([]);
    setCartCount(0);
  };

  const addToCart = async (item, quantity = 1) => {
    if (!user) {
      console.warn("User must be logged in to add items to cart");
      return false;
    }

    try {
      setIsAddingToCart(true);
      console.log("UserContext - Adding to cart:", item, "quantity:", quantity);

      const userIdToUse = user.user_id;
      await ShoppingCartAPI.addToCart(userIdToUse, item.item_id, quantity);

      // Reload cart items to get updated data from server
      await loadCartItems();

      console.log("Item successfully added to cart!");
      return true;
    } catch (error) {
      console.error("UserContext - Error adding to cart:", error);
      return false;
    } finally {
      setIsAddingToCart(false);
    }
  };

  const removeFromCart = async (itemId) => {
    if (!user) return false;

    try {
      const userIdToUse = user.user_id;
      await ShoppingCartAPI.removeFromCart(userIdToUse, itemId);

      // Reload cart items to get updated data from server
      await loadCartItems();

      console.log("Item successfully removed from cart!");
      return true;
    } catch (error) {
      console.error("UserContext - Error removing from cart:", error);
      return false;
    }
  };

  const updateCartItemQuantity = async (itemId, quantity) => {
    if (!user) return false;

    try {
      const userIdToUse = user.user_id;
      await ShoppingCartAPI.updateCartItemQuantity(
        userIdToUse,
        itemId,
        quantity
      );

      // Reload cart items to get updated data from server
      await loadCartItems();

      console.log("Cart item quantity updated successfully!");
      return true;
    } catch (error) {
      console.error("UserContext - Error updating cart item quantity:", error);
      return false;
    }
  };

  const clearCart = async () => {
    if (!user) return false;

    try {
      const userIdToUse = user.user_id;
      await ShoppingCartAPI.clearCart(userIdToUse);

      setCart([]);
      setCartCount(0);

      console.log("Cart cleared successfully!");
      return true;
    } catch (error) {
      console.error("UserContext - Error clearing cart:", error);
      return false;
    }
  };

  const value = {
    user,
    cart,
    cartCount,
    isAddingToCart,
    isLoadingCart,
    isLoggedIn: !!user,
    login,
    logout,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    loadCartItems, // Expose this in case you need to refresh cart manually
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
