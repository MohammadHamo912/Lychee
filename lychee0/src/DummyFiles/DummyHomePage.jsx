import React, { useRef, useState, useEffect } from "react";
import NavBar from "./../components/NavBar";
import Footer from "./../components/Footer";
import Carousel from "./../components/Carousel";
import ProductGrid from "./../components/ProductGrid";
import HeroSection from "./../components/HeroSection";
import CategoryGrid from "./../components/CategoryGrid";
import StoresGrid from "../components/StoreGrid";
import ItemGrid from "../components/ItemGrid";
import { getAllProducts } from "../api/products";
import { getAllStores } from "../api/stores"; // Import the stores API function
import "../ComponentsCss/HomePage.css";

// Mock data for the carousel
// Updated carousel slides with working placeholder URLs
const carouselSlides = [
  {
    title: "Spring Collection 2025",
    description:
      "Discover handcrafted products made with love by independent artisans.",
    buttonText: "Shop Now",
    buttonLink: "/collections/spring",
    imageUrl: "https://picsum.photos/600/400?random=1", // Working placeholder
  },
  {
    title: "Artisan Spotlight",
    description:
      "Meet our featured artisans and explore their unique creations.",
    buttonText: "Explore",
    buttonLink: "/artisans",
    imageUrl: "https://picsum.photos/600/400?random=2", // Working placeholder
  },
  {
    title: "Self-Care Essentials",
    description:
      "Treat yourself with our curated selection of wellness products.",
    buttonText: "View Collection",
    buttonLink: "/collections/self-care",
    imageUrl: "https://picsum.photos/600/400?random=3", // Working placeholder
  },
];

const HomePage = () => {
  const StoresGridRef = useRef(null);

  // Products state
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(null);

  // Stores state
  const [stores, setStores] = useState([]);
  const [storesLoading, setStoresLoading] = useState(true);
  const [storesError, setStoresError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProductsLoading(true);
        const data = await getAllProducts();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setProductsError("Failed to load products. Please try again later.");
      } finally {
        setProductsLoading(false);
      }
    };

    const fetchStores = async () => {
      try {
        setStoresLoading(true);
        const data = await getAllStores();
        setStores(data);
      } catch (err) {
        console.error("Error fetching stores:", err);
        setStoresError("Failed to load stores. Please try again later.");
      } finally {
        setStoresLoading(false);
      }
    };

    // Fetch both products and stores
    fetchProducts();
    fetchStores();
  }, []);

  const handleRetryProducts = async () => {
    try {
      setProductsLoading(true);
      setProductsError(null);
      const data = await getAllProducts();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
      setProductsError("Failed to load products. Please try again later.");
    } finally {
      setProductsLoading(false);
    }
  };

  const handleRetryStores = async () => {
    try {
      setStoresLoading(true);
      setStoresError(null);
      const data = await getAllStores();
      setStores(data);
    } catch (err) {
      console.error("Error fetching stores:", err);
      setStoresError("Failed to load stores. Please try again later.");
    } finally {
      setStoresLoading(false);
    }
  };

  const scrollToStoresGrid = () => {
    StoresGridRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="home-page">
      <NavBar />
      <main className="main-content">
        <HeroSection scrollToStoresGrid={scrollToStoresGrid} />

        <div className="category-grid-section section">
          <CategoryGrid />
        </div>

        <div className="carousel-section section">
          <Carousel slides={carouselSlides} />
        </div>

        <div className="product-grid-section section">
          {productsLoading ? (
            <div className="loading-message">
              <p>Loading products...</p>
            </div>
          ) : productsError ? (
            <div className="error-message">
              <p>{productsError}</p>
              <button onClick={handleRetryProducts} className="retry-btn">
                Retry
              </button>
            </div>
          ) : (
            <ProductGrid
              limit={4}
              header={"Featured Products"}
              products={products}
            />
          )}
        </div>

        <div ref={StoresGridRef} className="store-grid-section section">
          <StoresGrid
            limit={4}
            stores={stores}
            isLoading={storesLoading}
            error={storesError}
            onRetry={handleRetryStores}
          />
        </div>

        <div className="trending-products-section section">
          <ItemGrid
            limit={4}
            header={"Trending Items"}
            className="trending-items-grid"
          />
          <ItemGrid
            limit={4}
            header={"Top-Selling Items"}
            className="top-selling-items-grid"
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
