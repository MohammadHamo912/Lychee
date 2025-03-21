import React from "react";
import ShopCard from "./ShopCard";

const StoreHighlights = () => {
  // Sample featured stores data - replace with your actual data
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
    <div
      style={{
        backgroundColor: "#FFF5E1",
        padding: "60px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            color: "#8B3C5D",
            fontSize: "1.8rem",
            marginBottom: "30px",
            textAlign: "center",
          }}
        >
          Featured Stores
        </h2>

        <p
          style={{
            color: "#555",
            textAlign: "center",
            maxWidth: "700px",
            margin: "0 auto 40px",
            fontSize: "1.1rem",
          }}
        >
          Discover Ramallah's finest beauty shops and pharmacies, all in one
          place.
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "30px",
          }}
        >
          {featuredStores.map((store) => (
            <ShopCard key={store.id} shop={store} onViewShop={handleViewShop} />
          ))}
        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: "40px",
          }}
        >
          <a
            href="/shops"
            style={{
              backgroundColor: "#8B3C5D",
              color: "white",
              padding: "12px 24px",
              borderRadius: "4px",
              textDecoration: "none",
              fontWeight: "bold",
              display: "inline-block",
            }}
          >
            View All Stores
          </a>
        </div>
      </div>
    </div>
  );
};

export default StoreHighlights;
