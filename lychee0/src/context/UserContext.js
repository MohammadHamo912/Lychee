// src/context/UserContext.js
import React, { useState, useContext, createContext } from "react";
import CartService from "./cartService"; // adjust the path if needed

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

  const [cart, setCart] = useState([]); // optional: load initial cart items if needed
  const [isAddingToCart, setIsAddingToCart] = useState(false); // loading state

  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setCart([]);
  };

  const addToCart = async (item) => {
    if (!user) {
      console.warn("User must be logged in to add items to cart");
      return false;
    }

    try {
      setIsAddingToCart(true);
      console.log("UserContext - Adding to cart with user:", user);
      console.log("UserContext - User ID:", user.userId || user.id);
      console.log("UserContext - Item:", item);

      // Use user.userId instead of user.id (based on your user object structure)
      const userIdToUse = user.userId || user.id;
      await CartService.addToCart(userIdToUse, item.id, 1);

      // Update local cart state
      setCart((prev) => {
        // Check if item already exists in cart
        const existingItemIndex = prev.findIndex(
          (cartItem) => cartItem.id === item.id
        );
        if (existingItemIndex >= 0) {
          // Update quantity if item exists
          const updatedCart = [...prev];
          updatedCart[existingItemIndex] = {
            ...updatedCart[existingItemIndex],
            quantity: (updatedCart[existingItemIndex].quantity || 1) + 1,
          };
          return updatedCart;
        } else {
          // Add new item to cart
          return [...prev, { ...item, quantity: 1 }];
        }
      });

      console.log("Item successfully added to cart!");
      return true;
    } catch (error) {
      console.error("Error adding to cart:", error);
      return false;
    } finally {
      setIsAddingToCart(false);
    }
  };

  const value = {
    user,
    cart,
    isAddingToCart,
    isLoggedIn: !!user, // Add isLoggedIn property
    login,
    logout,
    addToCart,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
