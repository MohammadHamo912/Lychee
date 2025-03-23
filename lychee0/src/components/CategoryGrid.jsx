import React from "react";
import { Link } from "react-router-dom";
import "../ComponentsCss/CategoryGrid.css";
import mascaraPicture from "./../images/mascara.png";
import placeholder_skincare from "./../images/placeholder-skincare.png";
import placeholder_haircare from "./../images/placeholder-haircare.jpg";
import placeholder_fragrances from "./../images/placeholder-fragrances.jpg";

const CategoryGrid = () => {
  const categories = [
    {
      id: 1,
      name: "Skincare",
      imageUrl: placeholder_skincare,
      slug: "skincare",
    },
    {
      id: 2,
      name: "Makeup",
      imageUrl: mascaraPicture,
      slug: "makeup",
    },
    {
      id: 3,
      name: "Haircare",
      imageUrl: placeholder_haircare,
      slug: "haircare",
    },
    {
      id: 4,
      name: "Fragrances",
      imageUrl: placeholder_fragrances,
      slug: "fragrances",
    },
  ];

  return (
    <div className="category-grid">
      <h2 className="category-title">Shop By Category</h2>
      <div className="category-container">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/category/${category.slug}`}
            className="category-link"
          >
            <div className="category-card">
              <div
                className="category-image"
                style={{ backgroundImage: `url(${category.imageUrl})` }}
              />
              <div className="category-overlay">
                <h3 className="category-name">{category.name}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryGrid;
