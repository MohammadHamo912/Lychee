import { useState, useEffect } from "react";
import NavBar from "./../components/NavBar.jsx";
import Sidebar from "./../components/Sidebar";
import ProductGrid from "./../components/ProductGrid";
import Footer from "./../components/Footer";
import "../PagesCss/ProductListingPage.css";
import { getAllProducts } from "../api/products"; // Adjust path if needed

const ProductListingPage = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    category: "all",
    priceRange: [0, 1000],
    inStock: false,
  });

  // Fetch data from API on component mount
  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllProducts();

      // Ensure compatibility with your filter logic
      const formattedData = data.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category?.name || "unknown", // depends on backend shape
        image: product.imageUrl || "", // fallback if image is optional
        inStock: product.quantity > 0, // assuming quantity determines stock
      }));

      setAllProducts(formattedData);
      setProducts(formattedData);
    };

    fetchData();
  }, []);

  const handleFilterChange = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);

    const filtered = allProducts.filter((product) => {
      if (
        updatedFilters.category !== "all" &&
        product.category !== updatedFilters.category
      ) {
        return false;
      }

      if (
        product.price < updatedFilters.priceRange[0] ||
        product.price > updatedFilters.priceRange[1]
      ) {
        return false;
      }

      if (updatedFilters.inStock && !product.inStock) {
        return false;
      }

      return true;
    });

    setProducts(filtered);
  };

  return (
    <div className="plp-container">
      <NavBar />

      <div className="plp-content-wrapper">
        <aside className="plp-sidebar">
          <Sidebar filters={filters} onFilterChange={handleFilterChange} />
        </aside>

        <main className="plp-main-content">
          <h1>All Products</h1>
          <div className="plp-products-grid">
            <ProductGrid products={products} />
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default ProductListingPage;
