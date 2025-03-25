import React, { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./../PagesCss/ShopByCategoryPage.css";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import Breadcrumbs from "../components/Breadcrumbs";
import Pagination from "../components/Pagination";
import Sidebar from "../components/Sidebar"; // Import the new component
import dummyProducts from "../Data/dummyProducts";
import { dummyCoreData } from "../Data/dummyCoreData";
import haircarePlaceholder from "../images/placeholder-haircare.jpg";
import skincarePlaceholder from "../images/placeholder-skincare.png";
import makeupPlaceholder from "../images/placeholder-makeup.jpg";

const categoryImages = {
  skincare: skincarePlaceholder,
  haircare: haircarePlaceholder,
  makeup: makeupPlaceholder,
};
const getImageSrc = (category) =>
  categoryImages[category] || haircarePlaceholder;

const ShopByCategoryPage = () => {
  const { category } = useParams();
  const [sortOption, setSortOption] = useState("most-popular");
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    categories: ["Face Moisturizers"],
    brands: [],
    priceRange: "",
  });
  const productsPerPage = 12;

  const dummyProductsMapped = dummyProducts.map((product) => ({
    id: product.id,
    brand: product.shop_name,
    name: product.name,
    price: product.price,
    oldPrice: null,
    image: product.imageUrl,
    rating: 4,
    reviews: Math.floor(Math.random() * 100) + 20,
    discount: null,
    isNew: product.id % 2 === 0,
  }));

  const applyFilters = (products, filters) => {
    let filtered = [...products];
    if (filters.categories.length > 0) {
      filtered = filtered.filter((product) =>
        filters.categories.some((cat) => product.name.includes(cat))
      );
    }
    if (filters.brands.length > 0) {
      filtered = filtered.filter((product) =>
        filters.brands.includes(product.brand)
      );
    }
    if (filters.priceRange) {
      filtered = filtered.filter((product) => {
        const price = product.price;
        if (filters.priceRange === "Under $25") return price < 25;
        if (filters.priceRange === "$25 - $50")
          return price >= 25 && price <= 50;
        if (filters.priceRange === "$50 - $100")
          return price >= 50 && price <= 100;
        if (filters.priceRange === "Over $100") return price > 100;
        return true;
      });
    }
    return filtered;
  };

  const sortProducts = (products, sortOption) => {
    const sorted = [...products];
    switch (sortOption) {
      case "most-popular":
        return sorted.sort((a, b) => b.reviews - a.reviews);
      case "newest":
        return sorted.sort((a, b) => (b.isNew ? 1 : -1) - (a.isNew ? 1 : -1));
      case "price-low":
        return sorted.sort((a, b) => a.price - b.price);
      case "price-high":
        return sorted.sort((a, b) => b.price - a.price);
      case "rating":
        return sorted.sort((a, b) => b.rating - a.rating);
      default:
        return sorted;
    }
  };

  const filteredAndSortedProducts = useMemo(() => {
    const filtered = applyFilters(dummyProductsMapped, filters);
    return sortProducts(filtered, sortOption);
  }, [filters, sortOption]);

  const currentProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handleFilterChange = (type, value, checked) => {
    setFilters((prev) => {
      if (type === "categories" || type === "brands") {
        const updatedList = checked
          ? [...prev[type], value]
          : prev[type].filter((item) => item !== value);
        return { ...prev, [type]: updatedList };
      } else if (type === "priceRange") {
        return { ...prev, priceRange: checked ? value : "" };
      }
      return prev;
    });
  };

  const clearFilters = () => {
    setFilters({ categories: [], brands: [], priceRange: "" });
  };

  const categoryTitle = category
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : "Moisturizers";
  const categoryDescription = `Discover our collection of premium ${categoryTitle.toLowerCase()} designed to nourish and hydrate your skin.`;

  return (
    <div className="shop-by-category">
      <NavBar />
      <main className="main-content">
        <div className="breadcrumbs">
          <Breadcrumbs paths={dummyCoreData.breadcrumbPaths} />
        </div>
        <div className="category-header">
          <img src={getImageSrc(category)} alt={categoryTitle} />
          <div className="header-overlay">
            <div className="header-text">
              <h1>{categoryTitle}</h1>
              <p>{categoryDescription}</p>
            </div>
          </div>
        </div>
        <div className="content-wrapper">
          <Sidebar
            filters={filters}
            handleFilterChange={handleFilterChange}
            clearFilters={clearFilters}
          />
          <div className="products-section">
            <div className="products-header">
              <p>
                Showing {(currentPage - 1) * productsPerPage + 1} -{" "}
                {Math.min(
                  currentPage * productsPerPage,
                  filteredAndSortedProducts.length
                )}{" "}
                of {filteredAndSortedProducts.length} products
              </p>
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
              </div>
            </div>
            <div className="products-grid">
              {currentProducts.length > 0 ? (
                currentProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <p>No products match your filters.</p>
              )}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(
                filteredAndSortedProducts.length / productsPerPage
              )}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ShopByCategoryPage;
