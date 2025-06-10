import React, { useRef, useState, useEffect } from "react";
import NavBar from "./../components/NavBar";
import Footer from "./../components/Footer";
import Carousel from "./../components/Carousel";
import ProductGrid from "./../components/ProductGrid";
import HeroSection from "./../components/HeroSection";
import StoresGrid from "../components/StoreGrid";
import ItemGrid from "../components/ItemGrid";
import { getAllProducts } from "../api/products";
import { getAllStores } from "../api/stores";
import { getTopDiscountsForCarousel } from "../api/discounts"; // Import the new API function
import "../ComponentsCss/HomePage.css";

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

  // Discounts state for carousel
  const [carouselSlides, setCarouselSlides] = useState([]);
  const [discountsLoading, setDiscountsLoading] = useState(true);
  const [discountsError, setDiscountsError] = useState(null);

  // Default carousel slides as fallback
  const defaultCarouselSlides = [
    {
      title: "Spring Collection 2025",
      description:
        "Discover handcrafted products made with love by independent artisans.",
      buttonText: "Shop Now",
      buttonLink: "/collections/spring",
      imageUrl: "https://picsum.photos/600/400?random=1",
    },
    {
      title: "Artisan Spotlight",
      description:
        "Meet our featured artisans and explore their unique creations.",
      buttonText: "Explore",
      buttonLink: "/artisans",
      imageUrl: "https://picsum.photos/600/400?random=2",
    },
    {
      title: "Self-Care Essentials",
      description:
        "Treat yourself with our curated selection of wellness products.",
      buttonText: "View Collection",
      buttonLink: "/collections/self-care",
      imageUrl: "https://picsum.photos/600/400?random=3",
    },
  ];

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

    const fetchDiscountsForCarousel = async () => {
      try {
        setDiscountsLoading(true);
        const discounts = await getTopDiscountsForCarousel();
        console.log("Raw discounts from API:", discounts);

        // Transform discounts into carousel slides format
        if (discounts && discounts.length > 0) {
          const discountSlides = discounts.map((discount, index) => ({
            title: `${discount.discount_percentage}% OFF`,
            description: `Use code "${discount.code}" to get ${discount.discountPercentage}% discount on your purchase!`,
            buttonText: "Shop Now",
            buttonLink: "/products", // You can customize this link
            imageUrl: `https://picsum.photos/600/400?random=${index + 10}`, // Different random images
            discountCode: discount.code,
            discountPercentage: discount.discountPercentage,
          }));
          setCarouselSlides(discountSlides);
        } else {
          // Use default slides if no discounts available
          setCarouselSlides(defaultCarouselSlides);
        }
      } catch (err) {
        console.error("Error fetching discounts for carousel:", err);
        setDiscountsError("Failed to load discount offers.");
        // Use default slides as fallback
        setCarouselSlides(defaultCarouselSlides);
      } finally {
        setDiscountsLoading(false);
      }
    };

    // Fetch all data
    fetchProducts();
    fetchStores();
    fetchDiscountsForCarousel();
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

  const handleRetryDiscounts = async () => {
    try {
      setDiscountsLoading(true);
      setDiscountsError(null);
      const discounts = await getTopDiscountsForCarousel();

      if (discounts && discounts.length > 0) {
        const discountSlides = discounts.map((discount, index) => ({
          title: `${discount.discountPercentage}% OFF`,
          description: `Use code "${discount.code}" to get ${discount.discountPercentage}% discount on your purchase!`,
          buttonText: "Shop Now",
          buttonLink: "/products",
          imageUrl: `https://picsum.photos/600/400?random=${index + 10}`,
          discountCode: discount.code,
          discountPercentage: discount.discountPercentage,
        }));
        setCarouselSlides(discountSlides);
      } else {
        setCarouselSlides(defaultCarouselSlides);
      }
    } catch (err) {
      console.error("Error fetching discounts for carousel:", err);
      setDiscountsError("Failed to load discount offers.");
      setCarouselSlides(defaultCarouselSlides);
    } finally {
      setDiscountsLoading(false);
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

        <div className="carousel-section section">
          {discountsLoading ? (
            <div className="loading-message">
              <p>Loading discount offers...</p>
            </div>
          ) : discountsError ? (
            <div className="error-message">
              <p>{discountsError}</p>
              <button onClick={handleRetryDiscounts} className="retry-btn">
                Retry
              </button>
            </div>
          ) : (
            <Carousel slides={carouselSlides} />
          )}
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
          <ItemGrid limit={4} header={"Trending Items"} className="trendings" />
          <ItemGrid
            limit={4}
            header={"Top-Selling Items"}
            className="trending"
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
