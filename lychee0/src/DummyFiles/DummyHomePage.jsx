import React, { useRef } from "react";
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
import "../ComponentsCss/FeaturedProducts.css"; // Existing CSS for Featured

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
  const storeHighlightsRef = useRef(null);
  const scrollToStoreHighlights = () => {
    storeHighlightsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="home-page">
      <NavBar />
      <main className="main-content">
        <HeroSection />
        <div className="search-bar-section section">
          <SearchBar searchType="stores" />
        </div>
        <HeroSection scrollToStoreHighlights={scrollToStoreHighlights} />
        {"Put the searchbar here"}
        <div className="carousel-section section">
          <Carousel slides={carouselSlides} />
        </div>
        <div className="category-grid-section section">
          <CategoryGrid />
        </div>
        <div className="featured-products section">
          {" "}
          {" Convert this to Products section"}
          <h2 className="section-title">Featured Products</h2>
          <ProductGrid limit={4} />
        </div>

        {"Convert this to shops grid"}
        <div
          ref={storeHighlightsRef}
          className="store-highlights-section section"
        >
          <StoreHighlights />
        </div>
        <div className="trending-products-section section">
          <TrendingProducts /> {" Convert this to items grid"}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
