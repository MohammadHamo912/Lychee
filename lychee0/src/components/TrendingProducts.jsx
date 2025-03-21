import React from "react";
import ProductCard from "./ProductCard";

const TrendingProducts = () => {
  // Sample trending products data - replace with your actual data
  const trendingProducts = [
    {
      id: 1,
      name: "Hydrating Face Serum",
      imageUrl: "/placeholder-product1.jpg",
      description: "Advanced hydration serum with hyaluronic acid",
      price: 25.99,
      shop_name: "Glow Beauty",
    },
    {
      id: 2,
      name: "Matte Lipstick",
      imageUrl: "/placeholder-product2.jpg",
      description: "Long-lasting matte finish in a vibrant shade",
      price: 18.5,
      shop_name: "Makeup Haven",
    },
    {
      id: 3,
      name: "Vitamin C Cream",
      imageUrl: "/placeholder-product3.jpg",
      description: "Brightening facial cream with vitamin C",
      price: 32.99,
      shop_name: "Skincare Essentials",
    },
    {
      id: 4,
      name: "Eyeshadow Palette",
      imageUrl: "/placeholder-product4.jpg",
      description: "Versatile eyeshadow palette with 12 shades",
      price: 42.0,
      shop_name: "Makeup Haven",
    },
  ];

  // Handle adding products to cart
  const handleAddToCart = (product) => {
    console.log("Adding to cart:", product);
    // Implement your cart functionality here
  };

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "60px auto",
        padding: "0 20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <h2
          style={{
            color: "#8B3C5D",
            fontSize: "1.8rem",
            margin: 0,
          }}
        >
          Trending Now
        </h2>
        <a
          href="/shop"
          style={{
            color: "#B76E79",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          View All
        </a>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        {trendingProducts.map((product) => (
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
