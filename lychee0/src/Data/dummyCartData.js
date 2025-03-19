import { useState } from "react";

export const useCart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Organic Cotton T-Shirt",
      price: 29.99,
      quantity: 2,
      imageUrl: "https://via.placeholder.com/100",
      shop_name: "Eco Apparel",
      variants: "Color: Blue, Size: M",
    },
    {
      id: 2,
      name: "Handmade Ceramic Mug",
      price: 18.5,
      quantity: 1,
      imageUrl: "https://via.placeholder.com/100",
      shop_name: "Artisan Crafts",
      variants: "Style: Minimalist",
    },
    {
      id: 3,
      name: "Sustainable Bamboo Utensil Set",
      price: 12.99,
      quantity: 3,
      imageUrl: "https://via.placeholder.com/100",
      shop_name: "Green Living",
      variants: "Type: Travel Set",
    },
  ]);

  const updateQuantity = (itemId, newQuantity) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (itemId) => {
    setCartItems(cartItems.filter((item) => item.id !== itemId));
  };

  const applyPromo = (promoCode) => {
    console.log(`Promo code applied: ${promoCode}`);
    alert(`Promo code "${promoCode}" applied!`);
  };

  return { cartItems, updateQuantity, removeItem, applyPromo };
};
