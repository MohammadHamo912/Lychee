import React from "react";
import { Link } from "react-router-dom"; // Use Link instead of <a>
import ShopCard from "./ShopCard";
import "../ComponentsCss/StoreHighlights.css";

const StoreHighlights = () => {
  const featuredStores = [
    {
      id: 1,
      name: "Glow Beauty",
      logoUrl: "/placeholder-store1.jpg",
      description: "Premium skincare and beauty essentials",
    },
    {
      id: 2,
      name: "Makeup Haven",
      logoUrl: "/placeholder-store2.jpg",
      description: "Your destination for professional makeup products",
    },
    {
      id: 3,
      name: "Natural Pharmacy",
      logoUrl: "/placeholder-store3.jpg",
      description: "Organic and natural beauty solutions",
    },
  ];

  const handleViewShop = (shop) => {
    console.log("Viewing shop:", shop);
    // Navigate to shop page or implement desired functionality
  };

  return (
    <div className="store-highlights">
      <div className="store-highlights-container">
        <h2 className="store-title">Featured Stores</h2>
        <p className="store-subtitle">
          Discover Ramallah's finest beauty shops and pharmacies, all in one
          place.
        </p>
        <div className="store-container">
          {featuredStores.map((store) => (
            <ShopCard key={store.id} shop={store} onViewShop={handleViewShop} />
          ))}
        </div>
        <div className="view-all-container">
          <Link to="/shops" className="view-all-link">
            View All Stores
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StoreHighlights;
