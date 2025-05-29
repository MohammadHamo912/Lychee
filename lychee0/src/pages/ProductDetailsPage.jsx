import React from "react";
import { useParams, Link } from "react-router-dom";
import ProductDetails from "../ArchievedComponents/ProductDetails";
import dummyProducts from "../Data/dummyProducts";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import "../PagesCss/ProductDetailsPage.css"; // Optional CSS file for page-specific styling

const ProductDetailsPage = () => {
  const { id } = useParams();
  const product = dummyProducts.find((p) => p.id === parseInt(id));

  // Handlers for interactivity
  const handleAddToCart = (item) => {
    console.log("Added to cart:", item);
    // Add your cart logic here (e.g., update global state)
  };

  const handleBuyNow = (item) => {
    console.log("Buying now:", item);
    // Add your buy now logic here (e.g., redirect to checkout)
  };

  const handleWishlistToggle = (id, isWishlisted) => {
    console.log(`Wishlist ${isWishlisted ? "added" : "removed"} for ID: ${id}`);
    // Add your wishlist logic here (e.g., API call or state update)
  };

  // Update document title
  React.useEffect(() => {
    document.title = product
      ? `${product.name} | Lychee`
      : "Product Not Found | Lychee";
  }, [product]);

  // Render product details or a not found message
  return (
    <div className="product-details-page">
      <NavBar />
      <main className="main-content-product-detials-page">
        {product ? (
          <ProductDetails
            product={product}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            onWishlistToggle={handleWishlistToggle}
            defaultImage="/images/placeholder.jpg"
          />
        ) : (
          <div className="not-found">
            <h2>Product Not Found</h2>
            <p>
              We couldn’t find a product with ID {id}. It might have been
              removed or doesn’t exist.
            </p>
            <Link to="/shop" className="back-to-shop">
              Back to Shop
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetailsPage;
