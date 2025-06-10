// src/context/UserContext.js
import React, { useState, useContext, createContext, useEffect } from "react";
import ShoppingCartAPI from "../api/shoppingcartitems";

const UserContext = createContext();

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

  useEffect(() => {
    if (user) loadCartItems();
    else {
      setCart([]);
      setCartCount(0);
    }
  }, [user]);

  useEffect(() => {
    const total = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
    setCartCount(total);
  }, [cart]);

  const getUserId = () => user?.user_id || user?.id || user?.userId;

  const loadCartItems = async () => {
    const userId = getUserId();
    if (!userId) return;
    try {
      setIsLoadingCart(true);
      const cartItems = await ShoppingCartAPI.getCartItems(userId);
      setCart(cartItems || []);
    } catch (err) {
      console.error("Error loading cart items:", err);
      setCart([]);
    } finally {
      setIsLoadingCart(false);
    }
  };

  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setCart([]);
    setCartCount(0);
  };

  const addToCart = async (item, quantity = 1) => {
    const userId = getUserId();
    if (!userId) return false;
    try {
      setIsAddingToCart(true);
      await ShoppingCartAPI.addToCart(userId, item.item_id, quantity);
      await loadCartItems();
      return true;
    } catch (err) {
      console.error("Error adding to cart:", err);
      return false;
    } finally {
      setIsAddingToCart(false);
    }
  };

  const removeFromCart = async (itemId) => {
    const userId = getUserId();
    if (!userId) return false;
    try {
      await ShoppingCartAPI.removeFromCart(userId, itemId);
      await loadCartItems();
      return true;
    } catch (err) {
      console.error("Error removing from cart:", err);
      return false;
    }
  };

  const updateCartItemQuantity = async (itemId, quantity) => {
    const userId = getUserId();
    if (!userId) return false;
    try {
      await ShoppingCartAPI.updateCartItemQuantity(userId, itemId, quantity);
      await loadCartItems();
      return true;
    } catch (err) {
      console.error("Error updating cart item quantity:", err);
      return false;
    }
  };

  const clearCart = async () => {
    const userId = getUserId();
    if (!userId) return false;
    try {
      await ShoppingCartAPI.clearCart(userId);
      setCart([]);
      setCartCount(0);
      return true;
    } catch (err) {
      console.error("Error clearing cart:", err);
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
    getUserId,
    login,
    logout,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    loadCartItems,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
