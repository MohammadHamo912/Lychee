import { useState } from "react";
import NavBar from "./../components/NavBar.jsx";
import Sidebar from "./../components/Sidebar";
import ProductGrid from "./../components/ProductGrid";
import Footer from "./../components/Footer";
import dummyProducts from "../Data/dummyProducts.js";
import "../PagesCss/ProductListingPage.css"; // Import the CSS file

const ProductListingPage = () => {
  const [products, setProducts] = useState(dummyProducts);
  const [filters, setFilters] = useState({
    category: "all",
    priceRange: [0, 1000],
    inStock: false,
  });

  // Filter handling logic
  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });

    // Apply filters to products
    const filteredProducts = dummyProducts.filter((product) => {
      // Category filter
      if (filters.category !== "all" && product.category !== filters.category) {
        return false;
      }

      // Price range filter
      if (
        product.price < filters.priceRange[0] ||
        product.price > filters.priceRange[1]
      ) {
        return false;
      }

      // In stock filter
      if (filters.inStock && !product.inStock) {
        return false;
      }

      return true;
    });

    setProducts(filteredProducts);
  };

  return (
    <div className="plp-container">
      {/* Navbar at the top */}
      <NavBar />

      <div className="plp-content-wrapper">
        {/* Sidebar with filters */}
        <aside className="plp-sidebar">
          <Sidebar filters={filters} onFilterChange={handleFilterChange} />
        </aside>

        {/* Main content area with product grid */}
        <main className="plp-main-content">
          <h1>All Products</h1>
          <div className="plp-products-grid">
            <ProductGrid products={products} />
          </div>
        </main>
      </div>

      {/* Footer at the bottom */}
      <Footer />
    </div>
  );
};

export default ProductListingPage;
