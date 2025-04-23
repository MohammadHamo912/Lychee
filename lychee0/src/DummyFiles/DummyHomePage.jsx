import React, { useRef } from "react";
import NavBar from "./../components/NavBar";
import Footer from "./../components/Footer";
import Carousel from "./../components/Carousel";
import ProductGrid from "./../components/ProductGrid.jsx";
import HeroSection from "./../components/HeroSection";
import CategoryGrid from "./../components/CategoryGrid";
import StoresGrid from "../components/StoreGrid.jsx";
import ItemGrid from "../components/ItemGrid.jsx";
import "../ComponentsCss/HomePage.css"; // New CSS file
// Mock data for the carousel
const carouselSlides = [
  {
    title: "Spring Collection 2025",
    description:
      "Discover handcrafted products made with love by independent artisans.",
    buttonText: "Shop Now",
    buttonLink: "/collections/spring",
    imageUrl: "https://via.placeholder.com/600x400?text=Spring+Collection",
  },
  {
    title: "Artisan Spotlight",
    description:
      "Meet our featured artisans and explore their unique creations.",
    buttonText: "Explore",
    buttonLink: "/artisans",
    imageUrl: "https://via.placeholder.com/600x400?text=Artisan+Spotlight",
  },
  {
    title: "Self-Care Essentials",
    description:
      "Treat yourself with our curated selection of wellness products.",
    buttonText: "View Collection",
    buttonLink: "/collections/self-care",
    imageUrl: "https://via.placeholder.com/600x400?text=Self+Care",
  },
];

// Mock search suggestions
const searchSuggestions = [
  "Lip Gloss",
  "Handmade Candles",
  "Organic Skincare",
  "Sustainable Fashion",
  "Ceramic Mugs",
  "Artisanal Jewelry",
  "Eco-friendly Products",
  "Gift Sets",
];

const HomePage = () => {
  const StoresGridRef = useRef(null);
  const scrollToStoresGrid = () => {
    StoresGridRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="home-page">
      <NavBar />
      <main className="main-content">
        <HeroSection scrollToStoresGrid={scrollToStoresGrid} />

        <div className="category-grid-section section">
          <CategoryGrid />
        </div>
        <div className="carousel-section section">
          <Carousel slides={carouselSlides} />
        </div>

        <div className="product-grid-section section">
          <ProductGrid limit={4} header={"Featured Products"} />
        </div>

        <div ref={StoresGridRef} className="store-grid-section section">
          <StoresGrid limit={3} />
        </div>
        <div className="trending-products-section section">
          <ItemGrid limit={4} header={"Trending Items"} />
          <ItemGrid limit={4} header={"Top-Selling Items"} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
