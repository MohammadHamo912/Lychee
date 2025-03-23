import React from "react";
import ProductCard from "./ProductCard";
import "../ComponentsCss/ProductGrid.css";
import dummyProducts from "../Data/dummyProducts";
import { Link } from "react-router-dom"; // Import Link for navigation

const ProductGrid = ({ limit = dummyProducts.length }) => {
  const handleAddToCart = (product) => {
    console.log("Added to cart:", product);
  };

  const displayedProducts = dummyProducts.slice(0, limit); // Limit the number of products

  return (
    <div className="product-grid-container">
      <div className="product-grid">
        {displayedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
      {limit < dummyProducts.length && (
        <div className="see-all-container">
          <Link to="/products" className="see-all-link">
            Click to See All Products
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
