import React from "react";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import dummyProducts from "../Data/dummyProducts";
import "../ComponentsCss/ProductGrid.css";

const ProductGrid = ({ items, limit }) => {
  const products =
    Array.isArray(items) && items.length > 0 ? items : dummyProducts;

  const handleAddToCart = (product) => {
    console.log("Added to cart:", product);
  };

  const productsToShow = limit ? products.slice(0, limit) : products;

  return (
    <div className="product-grid-container">
      <div className="product-grid">
        {productsToShow.map((product) =>
          product ? (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ) : null
        )}
      </div>

      {limit && limit < products.length && (
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
