import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "../PagesCss/ProductPage.css";
import { getProductById } from "../api/products";
import { getProductVariantsByProductId } from "../api/productvariant";
import {
  getItemsByProductVariantId,
  getItemById,
  getAllItems,
  getAvailableVariantsForProduct,
} from "../api/items";
import { getReviews, addReview } from "../api/reviews"; // Import reviews API
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import axios from "axios";

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Product and variant states
  const [product, setProduct] = useState(null);
  const [productVariants, setProductVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [itemImages, setItemImages] = useState([]);
  const [availableItems, setAvailableItems] = useState([]);
  const [bestPriceInfo, setBestPriceInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI states
  const [activeTab, setActiveTab] = useState("description");
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  // Review states
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
    userId: 1, // You'll need to get this from your auth system
  });

  // Fetch product data on component mount
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);

        // Fetch product details
        const productData = await getProductById(id);
        if (!productData) {
          setError("Product not found");
          return;
        }
        setProduct(productData);

        // Try to get available variants using the enriched helper function
        try {
          const availableVariantsFromItems =
            await getAvailableVariantsForProduct(parseInt(id));

          if (
            availableVariantsFromItems &&
            availableVariantsFromItems.length > 0
          ) {
            setProductVariants(availableVariantsFromItems);
          } else {
            // Fallback to the original method
            const variantsData = await getProductVariantsByProductId(id);
            setProductVariants(variantsData || []);
          }
        } catch (variantError) {
          console.log("Using fallback variant fetching method");
          const variantsData = await getProductVariantsByProductId(id);
          setProductVariants(variantsData || []);
        }

        // If variants are available, fetch items and images for the first variant
        const initialVariants =
          productVariants.length > 0
            ? productVariants
            : await getProductVariantsByProductId(id);
        if (initialVariants && initialVariants.length > 0) {
          await fetchItemImages(initialVariants[0].Product_Variant_ID);
          await fetchAvailableItems(initialVariants[0].Product_Variant_ID);
        }

        // Fetch product reviews
        await fetchProductReviews();
      } catch (err) {
        console.error("Error fetching product data:", err);
        setError("Failed to load product data");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductData();
    }
  }, [id]);

  // Fetch product reviews
  const fetchProductReviews = async () => {
    try {
      setReviewsLoading(true);
      const reviewsData = await getReviews("product", parseInt(id));
      setReviews(reviewsData || []);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  // Handle review submission
  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!newReview.comment.trim()) {
      showTemporaryNotification("Please enter a comment");
      return;
    }

    try {
      // Try different payload formats in case of field name issues
      const reviewData = {
        Review_Type: "product",
        Target_ID: parseInt(id),
        User_ID: newReview.userId,
        Rating: newReview.rating,
        Comment: newReview.comment.trim(),
      };

      // Alternative format (uncomment if the above doesn't work)
      // const reviewData = {
      //   review_type: 'product',
      //   target_id: parseInt(id),
      //   user_id: newReview.userId,
      //   rating: newReview.rating,
      //   comment: newReview.comment.trim()
      // };

      console.log("Submitting review data:", reviewData); // Debug log

      await addReview(reviewData);

      // Reset form
      setNewReview({
        rating: 5,
        comment: "",
        userId: newReview.userId,
      });
      setShowReviewForm(false);

      // Refresh reviews
      await fetchProductReviews();

      showTemporaryNotification("Review submitted successfully!");
    } catch (err) {
      console.error("Full error object:", err);
      console.error("Error response:", err.response?.data);
      console.error("Error status:", err.response?.status);

      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to submit review. Please try again.";
      showTemporaryNotification(errorMessage);
    }
  };

  // Calculate average rating
  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.Rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  // Render star rating
  const renderStars = (rating, interactive = false, onRatingChange = null) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`star ${i <= rating ? "filled" : ""} ${
            interactive ? "interactive" : ""
          }`}
          onClick={interactive ? () => onRatingChange(i) : undefined}
          style={{
            cursor: interactive ? "pointer" : "default",
            color: i <= rating ? "#ffd700" : "#ddd",
            fontSize: "18px",
            marginRight: "2px",
          }}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Fetch available items for a variant and calculate best price
  const fetchAvailableItems = async (variantId) => {
    try {
      const items = await getItemsByProductVariantId(variantId);
      setAvailableItems(items || []);

      if (items && items.length > 0) {
        // Calculate best price info
        const bestPrice = Math.min(...items.map((item) => item.price));
        const bestPriceItem = items.find((item) => item.price === bestPrice);
        setBestPriceInfo({
          bestPrice,
          bestPriceItem,
          availableStores: items.length,
          priceRange: {
            min: bestPrice,
            max: Math.max(...items.map((item) => item.price)),
          },
        });
      } else {
        setBestPriceInfo(null);
      }
    } catch (err) {
      console.error("Error fetching available items:", err);
      setAvailableItems([]);
      setBestPriceInfo(null);
    }
  };

  // Fetch item images for thumbnails
  const fetchItemImages = async (variantId) => {
    try {
      const items = await getItemsByProductVariantId(variantId);

      if (items && items.length > 0) {
        // Get images for the first item
        const imagesResponse = await axios.get(
          `http://localhost:8081/api/item-images/item/${items[0].Item_ID}`
        );
        setItemImages(imagesResponse.data || []);
      }
    } catch (err) {
      console.error("Error fetching item images:", err);
    }
  };

  // Update document title
  useEffect(() => {
    document.title = product ? `${product.name} | Lychee` : "Product | Lychee";
  }, [product]);

  const showTemporaryNotification = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleVariantSelection = async (variant) => {
    console.log("Selected variant:", variant);
    setSelectedVariant(variant);
    // Fetch images and items for the selected variant
    await fetchItemImages(variant.productVariantId);
    await fetchAvailableItems(variant.productVariantId);
  };

  const handleFindBestPrice = async () => {
    if (!selectedVariant) {
      showTemporaryNotification("Please select a product variant first");
      return;
    }

    if (!bestPriceInfo || !bestPriceInfo.bestPriceItem) {
      showTemporaryNotification("This product variant is not available");
      return;
    }

    try {
      // Navigate to the best price item page
      navigate(`/item/${bestPriceInfo.bestPriceItem.Item_ID}`);
    } catch (err) {
      console.error("Error navigating to best price:", err);
      showTemporaryNotification("Error finding best price. Please try again.");
    }
  };

  // Helper function to get variant color for display
  const getVariantColor = (variant) => {
    const colorMap = {
      red: "#ff4444",
      blue: "#4444ff",
      green: "#44ff44",
      black: "#333333",
      white: "#ffffff",
      pink: "#ffb3d9",
      purple: "#9d4edd",
      brown: "#8b4513",
      yellow: "#ffed4a",
      orange: "#ff8c00",
    };

    const colorName = variant.color?.toLowerCase() || "default";
    return colorMap[colorName] || "#b76e79";
  };

  if (loading) {
    return (
      <div className="product-page">
        <NavBar />
        <main className="main-content">
          <div className="loading-container">Loading product...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-page">
        <NavBar />
        <main className="main-content">
          <div className="not-found">
            <h2>Product Not Found</h2>
            <p>
              {error ||
                `We couldn't find a product with ID ${id}. It might have been removed or doesn't exist.`}
            </p>
            <Link to="/" className="back-to-shop">
              Back to Shop
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="product-page">
      <NavBar />

      <main className="main-content">
        <div className="product-details-container">
          {showNotification && (
            <div className="notification">
              <span>{notificationMessage}</span>
            </div>
          )}

          {/* Left Side - Image Gallery */}
          <div className="product-gallery">
            <div className="main-image-wrapper">
              <img
                src={product.logo_url || "/default-product-image.png"}
                alt={product.name}
                className="product-image"
                onError={(e) => {
                  e.target.src = "/default-product-image.png";
                }}
              />
            </div>

            <div className="image-thumbnails">
              {itemImages.length > 0
                ? itemImages.slice(0, 4).map((image, index) => (
                    <div key={image.Image_ID} className="thumbnail-wrapper">
                      <img
                        src={image.image_url}
                        alt={
                          image.caption || `${product.name} view ${index + 1}`
                        }
                        className="thumbnail-image"
                        onError={(e) => {
                          e.target.src = "/default-product-image.png";
                        }}
                      />
                    </div>
                  ))
                : [1, 2, 3].map((i) => (
                    <div key={i} className="thumbnail-wrapper">
                      <img
                        src={product.logo_url || "/default-product-image.png"}
                        alt={`${product.name} view ${i}`}
                        className="thumbnail-image"
                        onError={(e) => {
                          e.target.src = "/default-product-image.png";
                        }}
                      />
                    </div>
                  ))}
            </div>
          </div>

          {/* Right Side - Product Details */}
          <div className="product-info-block">
            <div className="product-header">
              <div className="brand-badge">
                {product.brand || "Lychee Beauty"}
              </div>
              <h1 className="product-title">{product.name}</h1>

              {/* Rating Summary */}
              {reviews.length > 0 && (
                <div className="rating-summary">
                  <div className="average-rating">
                    {renderStars(Math.round(getAverageRating()))}
                    <span className="rating-value">
                      {getAverageRating()} ({reviews.length} review
                      {reviews.length !== 1 ? "s" : ""})
                    </span>
                  </div>
                </div>
              )}

              {/* Price Information */}
              {bestPriceInfo && (
                <div className="price-info">
                  <div className="best-price">
                    <span className="price-label">Best Price:</span>
                    <span className="price-value">
                      ${bestPriceInfo.bestPrice.toFixed(2)}
                    </span>
                  </div>
                  {bestPriceInfo.priceRange.min !==
                    bestPriceInfo.priceRange.max && (
                    <div className="price-range">
                      <span className="price-range-text">
                        Available from $
                        {bestPriceInfo.priceRange.min.toFixed(2)} - $
                        {bestPriceInfo.priceRange.max.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="availability-info">
                    <span>
                      Available at {bestPriceInfo.availableStores} store
                      {bestPriceInfo.availableStores !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Product Variants Selection */}
            {productVariants.length > 0 ? (
              <div className="product-variants">
                <h3 className="variants-title">Available Options</h3>
                <div className="variant-options">
                  {productVariants.map((variant) => (
                    <button
                      key={variant.Product_Variant_ID}
                      className={`variant-option ${
                        selectedVariant?.Product_Variant_ID ===
                        variant.Product_Variant_ID
                          ? "active"
                          : ""
                      }`}
                      onClick={() => handleVariantSelection(variant)}
                    >
                      <span
                        className="variant-color-circle"
                        style={{ backgroundColor: getVariantColor(variant) }}
                      ></span>
                      <div className="variant-details">
                        <span className="variant-color">{variant.color}</span>
                        <span className="variant-size">
                          Size: {variant.size}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
                {!selectedVariant && (
                  <p className="variant-selection-note">
                    Please select a variant to see pricing and availability
                  </p>
                )}
              </div>
            ) : (
              <div className="no-variants">
                <p>This product is currently not available</p>
              </div>
            )}

            <div className="button-group">
              <button
                className="buy-now-btn"
                onClick={handleFindBestPrice}
                disabled={
                  productVariants.length === 0 ||
                  !selectedVariant ||
                  !bestPriceInfo
                }
              >
                {productVariants.length === 0
                  ? "Not Available"
                  : !selectedVariant
                  ? "Select Variant First"
                  : !bestPriceInfo
                  ? "Not Available"
                  : "Find Best Price"}
              </button>
            </div>

            <div className="product-meta">
              <div className="shipping-info">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="1" y="3" width="15" height="13"></rect>
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                  <circle cx="5.5" cy="18.5" r="2.5"></circle>
                  <circle cx="18.5" cy="18.5" r="2.5"></circle>
                </svg>
                <span>Free shipping on orders over $35</span>
              </div>
              <div className="returns-info">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 2v6h6"></path>
                  <path d="M3 13a9 9 0 1 0 3-7.7L3 8"></path>
                </svg>
                <span>30-day hassle-free returns</span>
              </div>
            </div>

            <div className="product-tabs">
              <div className="tabs-header">
                <button
                  className={`tab-button ${
                    activeTab === "description" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("description")}
                >
                  Description
                </button>
                <button
                  className={`tab-button ${
                    activeTab === "availability" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("availability")}
                >
                  Availability
                </button>
                <button
                  className={`tab-button ${
                    activeTab === "reviews" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("reviews")}
                >
                  Reviews ({reviews.length})
                </button>
              </div>

              <div className="tab-content">
                {activeTab === "description" && (
                  <div className="description-tab">
                    <p>
                      {product.description ||
                        "No description available for this product."}
                    </p>
                  </div>
                )}

                {activeTab === "availability" && (
                  <div className="availability-tab">
                    {selectedVariant && availableItems.length > 0 ? (
                      <div className="availability-details">
                        <h4>
                          Available at {availableItems.length} store
                          {availableItems.length !== 1 ? "s" : ""}
                        </h4>
                        <div className="store-availability">
                          {availableItems.map((item) => (
                            <div key={item.Item_ID} className="store-item">
                              <div className="store-info">
                                <span className="store-name">
                                  Store ID: {item.Store_ID}
                                </span>
                                <span className="store-stock">
                                  Stock: {item.stockQuantity}
                                </span>
                              </div>
                              <div className="store-pricing">
                                <span className="store-price">
                                  ${item.price.toFixed(2)}
                                </span>
                                {item.discount > 0 && (
                                  <span className="store-discount">
                                    {item.discount}% off
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p>Select a variant to see availability information.</p>
                    )}
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="reviews-tab">
                    <div className="reviews-header">
                      <div className="reviews-summary">
                        {reviews.length > 0 ? (
                          <>
                            <div className="rating-overview">
                              <div className="average-rating-large">
                                <span className="rating-number">
                                  {getAverageRating()}
                                </span>
                                <div className="rating-stars">
                                  {renderStars(Math.round(getAverageRating()))}
                                </div>
                                <span className="review-count">
                                  Based on {reviews.length} review
                                  {reviews.length !== 1 ? "s" : ""}
                                </span>
                              </div>
                            </div>
                          </>
                        ) : (
                          <p>No reviews yet for this product.</p>
                        )}
                      </div>

                      <button
                        className="write-review-btn"
                        onClick={() => setShowReviewForm(!showReviewForm)}
                      >
                        {showReviewForm ? "Cancel" : "Write a Review"}
                      </button>
                    </div>

                    {showReviewForm && (
                      <div className="review-form">
                        <h4>Write a Review</h4>
                        <form onSubmit={handleReviewSubmit}>
                          <div className="rating-input">
                            <label>Rating:</label>
                            <div className="star-rating">
                              {renderStars(newReview.rating, true, (rating) =>
                                setNewReview({ ...newReview, rating })
                              )}
                            </div>
                          </div>

                          <div className="comment-input">
                            <label htmlFor="review-comment">Your Review:</label>
                            <textarea
                              id="review-comment"
                              value={newReview.comment}
                              onChange={(e) =>
                                setNewReview({
                                  ...newReview,
                                  comment: e.target.value,
                                })
                              }
                              placeholder="Share your thoughts about this product..."
                              rows="4"
                              required
                            />
                          </div>

                          <div className="form-actions">
                            <button type="submit" className="submit-review-btn">
                              Submit Review
                            </button>
                            <button
                              type="button"
                              className="cancel-review-btn"
                              onClick={() => setShowReviewForm(false)}
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

                    <div className="reviews-list">
                      {reviewsLoading ? (
                        <p>Loading reviews...</p>
                      ) : reviews.length > 0 ? (
                        reviews.map((review) => (
                          <div key={review.Review_ID} className="review-item">
                            <div className="review-header">
                              <div className="review-rating">
                                {renderStars(review.Rating)}
                              </div>
                              <div className="review-date">
                                {formatDate(review.Created_At)}
                              </div>
                            </div>
                            <div className="review-content">
                              <p>{review.Comment}</p>
                            </div>
                            <div className="review-author">
                              <span>User ID: {review.User_ID}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        !showReviewForm && (
                          <div className="no-reviews">
                            <p>
                              No reviews yet. Be the first to share your
                              thoughts!
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductPage;
