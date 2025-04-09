// Example 1: Products Grid
import React from "react";
import ReusableGrid from "./../components/ReusableGrid";
import ProductCard from "./../components/ProductCard";
import dummyProducts from "../Data/dummyProducts";

const ProductGrid = ({ limit, header }) => {
  const handleAddToCart = (product) => {
    console.log("Added to cart:", product);
  };

  return (
    <ReusableGrid
      headerContent={<h2>{header}</h2>}
      items={dummyProducts}
      CardComponent={ProductCard}
      limit={limit}
      cardProps={{ onAddToCart: handleAddToCart }}
      viewAllLink="/productlistingpage"
      viewAllText="See All Products"
    />
  );
};
export default ProductGrid;
