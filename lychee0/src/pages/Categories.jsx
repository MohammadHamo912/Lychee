import React from "react";
import { Link } from "react-router-dom";
import "../PagesCss/Categories.css";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

import skincareImg from "../images/placeholder-skincare.png";
import makeupImg from "../images/placeholder-makeup.jpg";
import haircareImg from "../images/placeholder-haircare.jpg";
import fragranceImg from "../images/placeholder-fragrances.jpg";

const categories = [
  {
    name: "Skincare",
    image: skincareImg,
    // Updated to link to products page with category filter
    path: "/productlistingpage?category=Skincare",
    tagline: "Glow up with clean skin",
  },
  {
    name: "MakeUp",
    image: makeupImg,
    // Updated to link to products page with category filter
    path: "/productlistingpage?category=Makeup",
    tagline: "Bold shades for every mood",
  },
  {
    name: "Haircare",
    image: haircareImg,
    // Updated to link to products page with category filter
    path: "/productlistingpage?category=Haircare",
    tagline: "For silky, strong hair",
  },
  {
    name: "Fragrances",
    image: fragranceImg,
    // Updated to link to products page with category filter
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
              key={cat.name}
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
