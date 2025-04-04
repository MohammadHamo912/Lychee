// Example 1: Products Grid
import React from "react";
import ReusableGrid from "./../components/ReusableGrid";
import ProductCard from "./../components/ProductCard";
import dummyProducts from "../Data/dummyProducts";

const ProductGrid = () => {
  const handleAddToCart = (product) => {
    console.log("Added to cart:", product);
  };

  return (
    <ReusableGrid
      headerContent={<h2>Featured Products</h2>}
      items={dummyProducts}
      CardComponent={ProductCard}
      limit={6}
      cardProps={{ onAddToCart: handleAddToCart }}
      viewAllLink="/products"
      viewAllText="See All Products"
    />
  );
};
export default ProductGrid;
