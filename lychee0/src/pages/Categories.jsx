import React from "react";
import { Link } from "react-router-dom";
import "../PagesCss/Categories.css";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

import skincareImg from "../images/placeholder-skincare.png";
import makeupImg from "../images/placeholder-makeup.jpg";
import haircareImg from "../images/placeholder-haircare.jpg";
import fragranceImg from "../images/placeholder-fragrances.jpg";

// Ensure the "path" query params match the exact category names expected in the database
const categories = [
  {
    name: "Skincare",
    image: skincareImg,
    path: "/productlistingpage?category=Skincare", // Must match DB value exactly
    tagline: "Glow up with clean skin",
  },
  {
    name: "Makeup",
    image: makeupImg,
    path: "/productlistingpage?category=Makeup",
    tagline: "Bold shades for every mood",
  },
  {
    name: "Haircare",
    image: haircareImg,
    path: "/productlistingpage?category=Haircare",
    tagline: "For silky, strong hair",
  },
  {
    name: "Fragrances",
    image: fragranceImg,
    path: "/productlistingpage?category=Fragrances",
    tagline: "Scents that define you",
  },
];

export default function CategoriesPage() {
  return (
    <div className="categories-page">
      <NavBar />

      <main className="main-content">
        <h1 className="page-title">Shop by Category</h1>
        <p className="page-subtitle">Find your beauty essentials by category</p>

        <div className="categories-grid">
          {categories.map((cat, index) => (
            <Link
              to={cat.path}
              key={`${cat.name}-${index}`} // Safe unique key
              className="category-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <img src={cat.image} alt={cat.name} className="category-image" />
              <div className="category-info">
                <h2>{cat.name}</h2>
                <p>{cat.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
