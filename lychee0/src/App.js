import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp"; // Make sure this is the correct path
import Login from "./pages/Login"; // Make sure this is the correct path
import NavBar from "./components/NavBar";
import ProductCard from "./components/ProductCard"
import lipgloss from './images/lipgloss.jpeg';
import shop1Url from './images/shop1SampleImage.png';
import ProductGrid from "./components/ProductGrid";
import ShopCard from "./components/ShopCard";
import ShopGrid from "./components/ShopGrid";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/navbar" element={<NavBar />} />
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
                shop_name: ""
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
        <Route path="/shops" element={<ShopGrid />} />
      </Routes>
    </Router>
  );
}

export default App;
