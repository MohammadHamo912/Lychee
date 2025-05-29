// cartData.js
import { useState } from "react";

export const useCartCheckout = () => {
  const [cart, setCart] = useState([
    { id: 1, name: "Product 1", price: 29.99, quantity: 2 },
    { id: 2, name: "Product 2", price: 49.99, quantity: 1 },
  ]);

  const calculateCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCheckoutSubmit = (formData) => {
    console.log("Order submitted with data:", formData);
    console.log("Cart total:", calculateCartTotal());
    alert("Order placed successfully!");
    setCart([]); // Clear cart after successful order
  };

  return { cart, setCart, calculateCartTotal, handleCheckoutSubmit };
};
