// Example 1: Products Grid
import React from "react";
import ReusableGrid from "./../components/ReusableGrid";
import ProductCard from "./../components/ProductCard";

const ProductGrid = ({ limit, header, products }) => {
  const handleAddToCart = (product) => {
    console.log("Added to cart:", product);
  };

  return (
    <ReusableGrid
      headerContent={<h2>{header}</h2>}
      items={products}
      CardComponent={ProductCard}
      limit={limit}
      cardProps={{ onAddToCart: handleAddToCart }}
      viewAllLink="/productlistingpage"
      viewAllText="See All Products"
    />
  );
};
export default ProductGrid;
