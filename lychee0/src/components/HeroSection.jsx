import React from "react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <div
      className="hero-container"
      style={{
        backgroundImage:
          'linear-gradient(rgba(255, 245, 225, 0.7), rgba(255, 245, 225, 0.9)), url("/hero-background.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "60px 5%",
        textAlign: "center",
        borderRadius: "8px",
        margin: "20px auto",
        maxWidth: "1200px",
      }}
    >
      <h1
        style={{
          color: "#8B3C5D",
          fontSize: "2.5rem",
          marginBottom: "20px",
        }}
      >
        Discover Your Beauty Essentials
      </h1>
      <p
        style={{
          color: "#555",
          fontSize: "1.2rem",
          maxWidth: "700px",
          margin: "0 auto 30px",
        }}
      >
        Shop premium cosmetics from Ramallah's best beauty shops and pharmacies,
        all in one place.
      </p>
      <div
        style={{
          display: "flex",
          gap: "15px",
          justifyContent: "center",
          marginBottom: "40px",
        }}
      >
        <Link
          to="/shop"
          style={{
            backgroundColor: "#8B3C5D",
            color: "white",
            padding: "12px 24px",
            borderRadius: "4px",
            textDecoration: "none",
            fontWeight: "bold",
            transition: "background-color 0.3s",
          }}
        >
          Shop Now
        </Link>
        <Link
          to="/collections"
          style={{
            backgroundColor: "transparent",
            color: "#8B3C5D",
            padding: "12px 24px",
            borderRadius: "4px",
            textDecoration: "none",
            fontWeight: "bold",
            border: "2px solid #8B3C5D",
            transition: "background-color 0.3s",
          }}
        >
          View Collections
        </Link>
      </div>

      {/* Featured promotion banner */}
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ flex: 1 }}>
          <h3 style={{ color: "#8B3C5D", marginBottom: "10px" }}>
            Spring Collection
          </h3>
          <p style={{ color: "#555" }}>Enjoy 20% off on all new arrivals</p>
        </div>
        <Link
          to="/spring-collection"
          style={{
            backgroundColor: "#B76E79",
            color: "white",
            padding: "10px 20px",
            borderRadius: "4px",
            textDecoration: "none",
          }}
        >
          Explore
        </Link>
      </div>
    </div>
  );
};

export default HeroSection;
