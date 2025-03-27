import React from "react";
import NavBar from "./../components/NavBar";
import Footer from "./../components/Footer";
import SearchBar from "./../components/SearchBar";
import Carousel from "./../components/Carousel";
import ProductGrid from "./../components/ProductGrid";
import HeroSection from "./../components/HeroSection";
import CategoryGrid from "./../components/CategoryGrid";
import TrendingProducts from "./../components/TrendingProducts";
import StoreHighlights from "./../components/StoreHighlights";
import "../ComponentsCss/HomePage.css"; // New CSS file
import "../ComponentsCss/FeaturedProducts.css"; // Existing CSS for Featured Products
import dummyCategoriesWithCounts from "../Data/dummyCategories";
import dummyProducts from "../Data/dummyProducts";
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
  const products = dummyProducts || [];
  const categories = dummyCategoriesWithCounts || [];

  return (
    <div className="home-page">
      <NavBar />
      <main className="main-content">
        <HeroSection />
        <div className="search-bar-section section">
          <SearchBar
            placeholder="Search for products, shops, or collections..."
            suggestions={searchSuggestions}
          />
        </div>
        <div className="carousel-section section">
          <Carousel slides={carouselSlides} />
        </div>
        <div className="category-grid-section section">
          <CategoryGrid />
        </div>
        <div className="featured-products section">
          <h2 className="section-title">Featured Products</h2>
          <ProductGrid limit={4} />
        </div>
        <div className="trending-products-section section">
          <TrendingProducts />
        </div>
        <div className="store-highlights-section section">
          <StoreHighlights />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
