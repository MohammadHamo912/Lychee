import React, { useState } from "react";
import "./../PagesCss/ShopByCategoryPage.css";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import Breadcrumbs from "../components/Breadcrumbs";
import Pagination from "../components/Pagination";

//dummy products
import dummyProducts from "../Data/dummyProducts";
import { dummyCoreData } from "../Data/dummyCoreData";
const ShopByCategoryPage = () => {
  const [sortOption, setSortOption] = useState("most-popular");
  // Map dummyProducts to match ProductCard expected structure
  const [products, setProducts] = useState(
    dummyProducts.map((product) => ({
      id: product.id,
      brand: product.shop_name, // Using shop_name as brand
      name: product.name,
      price: product.price,
      oldPrice: null, // No oldPrice in dummyProducts, set to null
      image: product.imageUrl, // Renaming imageUrl to image
      rating: 4, // Default rating since it's not provided
      reviews: Math.floor(Math.random() * 100) + 20, // Random reviews between 20-119
      discount: null, // No discount in dummyProducts, set to null
      isNew: product.id % 2 === 0, // Arbitrary logic for 'new' badge
    }))
  );

  return (
    <div className="shop-by-category">
      <NavBar />

      <main className="main-content">
        <div className="breadcrumbs">
          <Breadcrumbs paths={dummyCoreData.breadcrumbPaths} />
        </div>

        <div className="category-header">
          <img
            src="./../images/placeholder-haircare.jpg.jpg"
            alt="Moisturizers"
          />
          <div className="header-overlay">
            <div className="header-text">
              <h1>Moisturizers</h1>
              <p>
                Discover our collection of premium moisturizers designed to
                nourish and hydrate your skin.
              </p>
            </div>
          </div>
        </div>

        <div className="content-wrapper">
          <aside className="filters">
            <div className="filter-section">
              <h3>Categories</h3>
              <label>
                <input type="checkbox" defaultChecked /> Face Moisturizers (45)
              </label>
              <label>
                <input type="checkbox" /> Night Creams (32)
              </label>
              <label>
                <input type="checkbox" /> Gel Moisturizers (28)
              </label>
              <label>
                <input type="checkbox" /> Oil-Free (24)
              </label>
            </div>
            <div className="filter-section">
              <h3>Brand</h3>
              <label>
                <input type="checkbox" /> La Mer (12)
              </label>
              <label>
                <input type="checkbox" /> Tatcha (15)
              </label>
              <label>
                <input type="checkbox" /> Drunk Elephant (18)
              </label>
              <label>
                <input type="checkbox" /> Sunday Riley (10)
              </label>
            </div>
            <div className="filter-section">
              <h3>Price Range</h3>
              <label>
                <input type="radio" name="price" /> Under $25
              </label>
              <label>
                <input type="radio" name="price" /> $25 - $50
              </label>
              <label>
                <input type="radio" name="price" /> $50 - $100
              </label>
              <label>
                <input type="radio" name="price" /> Over $100
              </label>
            </div>
            <button className="clear-filters">Clear All Filters</button>
          </aside>

          <div className="products-section">
            <div className="products-header">
              <p>Showing 1-12 of 48 products</p>
              <div className="sort-controls">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="most-popular">Most Popular</option>
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Rating</option>
                </select>
                <button>
                  <i className="fas fa-th-large"></i>
                </button>
                <button>
                  <i className="fas fa-list"></i>
                </button>
              </div>
            </div>
            <div className="products-grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <Pagination
              currentPage={dummyCoreData.currentPage}
              totalPages={dummyCoreData.totalPages}
              onPageChange={(page) => console.log("Page changed to:", page)}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ShopByCategoryPage;
