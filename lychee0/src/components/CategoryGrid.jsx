import React from "react";
import { Link } from "react-router-dom";

const CategoryGrid = () => {
  // Sample categories - you would replace these with your actual categories
  const categories = [
    {
      id: 1,
      name: "Skincare",
      imageUrl: "/placeholder-skincare.jpg",
      slug: "skincare",
    },
    {
      id: 2,
      name: "Makeup",
      imageUrl: "/placeholder-makeup.jpg",
      slug: "makeup",
    },
    {
      id: 3,
      name: "Haircare",
      imageUrl: "/placeholder-haircare.jpg",
      slug: "haircare",
    },
    {
      id: 4,
      name: "Fragrances",
      imageUrl: "/placeholder-fragrances.jpg",
      slug: "fragrances",
    },
  ];

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "60px auto",
        padding: "0 20px",
      }}
    >
      <h2
        style={{
          color: "#8B3C5D",
          fontSize: "1.8rem",
          marginBottom: "30px",
          textAlign: "center",
        }}
      >
        Shop By Category
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "25px",
        }}
      >
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/category/${category.slug}`}
            style={{ textDecoration: "none" }}
          >
            <div
              style={{
                position: "relative",
                borderRadius: "8px",
                overflow: "hidden",
                height: "220px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                transition: "transform 0.3s",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  backgroundImage: `url(${category.imageUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  height: "100%",
                  width: "100%",
                }}
              ></div>
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: "15px",
                  backgroundColor: "rgba(255, 245, 225, 0.9)",
                  textAlign: "center",
                }}
              >
                <h3
                  style={{
                    color: "#8B3C5D",
                    margin: 0,
                    fontSize: "1.2rem",
                  }}
                >
                  {category.name}
                </h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryGrid;
