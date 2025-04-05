import React from "react";
import { Link } from "react-router-dom";
import "./../ComponentsCss/HeroSection.css"; // Import the CSS file

const HeroSection = ({ scrollToStoresGrid }) => {
  return (
    <div className="hero-container" style={{ maxHeight: "2000px" }}>
      <h1 className="hero-title">Discover Your Beauty Essentials</h1>
      <p className="hero-description">
        Shop premium cosmetics from Ramallah's best beauty shops and pharmacies,
        all in one place.
      </p>
      <div className="hero-buttons">
        <button onClick={scrollToStoresGrid} className="hero-button-primary">
          Shop Now
        </button>
        <Link to="/categories " className="hero-button-secondary">
          View Categories
        </Link>
      </div>

      {/* Featured promotion banner */}
    </div>
  );
};

export default HeroSection;
