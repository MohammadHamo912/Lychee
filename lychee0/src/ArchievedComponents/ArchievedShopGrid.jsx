import React from "react";
import ShopCard from "./ShopCard";
import "./ArchievedShopGrid.css";

// Import the images from src/images
import shop1SampleImage from "../images/shop1SampleImage.png";
import shop2SampleImage from "../images/shop2SampleImage.jpeg";

const shops = [
  {
    id: 1,
    name: "Elegance Boutique",
    logoUrl: shop1SampleImage,
    description: "Curated collection of elegant and timeless pieces.",
    featured: true,
    productCount: 42,
  },
  {
    id: 2,
    name: "Rose & Gold",
    logoUrl: shop2SampleImage,
    description: "Luxury accessories for the modern woman.",
    featured: true,
    productCount: 37,
  },
  {
    id: 3,
    name: "Berry Essence",
    logoUrl: shop1SampleImage,
    description: "Premium skincare with natural ingredients.",
    featured: false,
    productCount: 25,
  },
  {
    id: 4,
    name: "Lychee Living",
    logoUrl: shop2SampleImage,
    description: "Lifestyle products that elevate your everyday.",
    featured: false,
    productCount: 31,
  },
];

const ShopGrid = ({ featuredOnly = false }) => {
  const handleViewShop = (shop) => {
    console.log("Viewing shop:", shop);
    // Add navigation logic here, e.g.,
    // history.push(`/store/${shop.id}`);
  };

  const displayedShops = featuredOnly
    ? shops.filter((shop) => shop.featured)
    : shops;

  return (
    <section className="section shop-section">
      <div className="container">
        <div className="section-header">
          <h1 className="section-title">Our Curated Shops</h1>
          <p className="section-description">
            Discover unique collections from our featured partners
          </p>
        </div>
        <div className="shop-grid">
          {displayedShops.map((shop) => (
            <ShopCard key={shop.id} shop={shop} onViewShop={handleViewShop} />
          ))}
        </div>
        {featuredOnly && (
          <div className="view-all-container">
            <a href="/shops" className="link view-all-link">
              View All Shops
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default ShopGrid;
