import React from "react";
import NavBar from "./../components/NavBar";
import Footer from "./../components/Footer";
import SearchBar from "./../components/SearchBar";
import Carousel from "./../components/Carousel";
import ProductGrid from "./../components/ProductGrid";

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
  return (
    <div className="home-page">
      <NavBar />

      <div
        className="main-content"
        style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}
      >
        {/* Search Bar */}
        <div style={{ marginBottom: "30px" }}>
          <SearchBar
            placeholder="Search for products, shops, or collections..."
            suggestions={searchSuggestions}
          />
        </div>

        {/* Carousel/Banner */}
        <div style={{ marginBottom: "40px" }}>
          <Carousel slides={carouselSlides} />
        </div>

        {/* Featured Products */}
        <div className="section">
          <h2
            className="section-title"
            style={{
              color: "#8b3c5d",
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            Featured Products
          </h2>
          <ProductGrid />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;
