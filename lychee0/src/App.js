import "./App.css";
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp"; // Make sure this is the correct path
import Login from "./pages/Login"; // Make sure this is the correct path
import NavBar from "./components/NavBar";
import ProductCard from "./components/ProductCard";
import lipgloss from "./images/lipgloss.jpeg";
import shop1Url from "./images/shop1SampleImage.png";
import ProductGrid from "./components/ProductGrid";
import ShopCard from "./components/ShopCard";
import ShopGrid from "./components/ShopGrid";
import Footer from "./components/Footer";
import ShoppingCart from "./components/ShoppingCart";
import CheckoutForm from "./components/CheckoutForm";

function App() {
  {
    /*dummy data for shopping cart */
  }
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

  // Update quantity function
  const updateQuantity = (itemId, newQuantity) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Remove item function
  const removeItem = (itemId) => {
    setCartItems(cartItems.filter((item) => item.id !== itemId));
  };

  // Apply promo code function
  const applyPromo = (promoCode) => {
    console.log(`Promo code applied: ${promoCode}`);
    // Here you would typically validate the promo code and apply a discount
    alert(`Promo code "${promoCode}" applied!`);
  };

  {
    /* end of dummy data */
  }

  {
    /*dummy for chechout */
  }

  // Sample cart state
  const [cart, setCart] = useState([
    { id: 1, name: "Product 1", price: 29.99, quantity: 2 },
    { id: 2, name: "Product 2", price: 49.99, quantity: 1 },
  ]);

  // Calculate cart total - dummy implementation
  const calculateCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Handle checkout submission - dummy implementation
  const handleCheckoutSubmit = (formData) => {
    console.log("Order submitted with data:", formData);
    console.log("Cart total:", calculateCartTotal());

    // Here you would typically:
    // 1. Process the payment
    // 2. Create an order in your database
    // 3. Clear the cart
    // 4. Redirect to a success page

    // For testing, let's just alert the user
    alert("Order placed successfully!");

    // Clear cart after successful order
    setCart([]);
  };

  {
    /*end dummy for chechout */
  }

  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/navbar" element={<NavBar />} />
        <Route path="/footer" element={<Footer />} />
        <Route path="/shops" element={<ShopGrid />} />

        <Route
          path="/productcard"
          element={
            <ProductCard
              product={{
                id: 1,
                name: "Lip Gloss",
                imageUrl: lipgloss,
                description: "This is a descreption",
                price: 9.99,
                shop_name: "",
              }}
              onAddToCart={(p) => console.log("Add to cart:", p)}
            />
          }
        />
        <Route path="/products" element={<ProductGrid />} />
        <Route
          path="/shopcard"
          element={
            <ShopCard
              shop={{ id: 1, name: "Loreal", logoUrl: shop1Url }}
              onViewShop={(shop) => console.log("Viewing shop:", shop)}
              featured={false}
            />
          }
        />

        <Route
          path="/shoppingcart"
          element={
            <ShoppingCart
              cartItems={cartItems}
              updateQuantity={updateQuantity}
              removeItem={removeItem}
              applyPromo={applyPromo}
            />
          }
        />

        <Route
          path="/checkout"
          element={
            <CheckoutForm
              onSubmit={handleCheckoutSubmit}
              cartTotal={calculateCartTotal()}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
