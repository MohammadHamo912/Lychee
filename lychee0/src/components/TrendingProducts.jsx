import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import "../ComponentsCss/TrendingProducts.css";
import dummyProducts from "../Data/dummyProducts"; // Dummy data

const TrendingProducts = () => {
  const handleAddToCart = (product) => {
    console.log("Adding to cart:", product);
    // Add-to-cart logic here
  };

  // Intersection Observer for animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".product-card").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="trending-products">
      <div className="trending-header">
        <h2 className="trending-title">Trending Now</h2>

        <Link to="/shop" className="view-all-link">
          {"VIEW ALL "}
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
