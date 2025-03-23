import React from "react";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import "../ComponentsCss/TrendingProducts.css";
import dummyProducts from "../Data/dummyProducts"; // Import dummyProducts

const TrendingProducts = () => {
  const handleAddToCart = (product) => {
    console.log("Adding to cart:", product);
    // Implement your cart functionality here
  };

  return (
    <div className="trending-products">
      <div className="trending-header">
        <h2 className="trending-title">Trending Now</h2>
        <Link to="/shop" className="view-all-link">
          View All
        </Link>
      </div>
      <div className="trending-container">
        {dummyProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    </div>
  );
};

export default TrendingProducts;
