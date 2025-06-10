import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import "../PagesCss/ProductPage.css";

import { useUser } from "../context/UserContext";

import { getProductById } from "../api/products";

import { getProductVariantsByProductId } from "../api/productvariant";

import {
  getItemsByProductVariantId,
  getAvailableVariantsForProduct,
} from "../api/items";
import { getItemImagesByItemId } from "../api/itemImage.js";

import { getUserById } from "../api/users";
import { getReviews, addReview } from "../api/reviews";

const ProductPage = () => {
  const { product_id } = useParams();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useUser();
  const productId = product_id;
  console.log("ProductPage - Current user from context:", user);
  console.log("ProductPage - Product ID from URL:", productId);
  const [product, setProduct] = useState(null);
  const [productVariants, setProductVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [itemImages, setItemImages] = useState([]);
  const [availableItems, setAvailableItems] = useState([]);
  const [bestPriceInfo, setBestPriceInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState("description");
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("success");

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });

  const [userNamesCache, setUserNamesCache] = useState({});

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);

        const productData = await getProductById(productId);
        if (!productData) {
          setError("Product not found");
          return;
        }
        setProduct(productData);

        let variants = [];

        try {
          const availableVariantsFromItems =
            await getAvailableVariantsForProduct(parseInt(productId));
          variants = availableVariantsFromItems || [];
        } catch {
          variants = await getProductVariantsByProductId(productId);
        }

        setProductVariants(variants);

        if (variants.length > 0) {
          const firstVariant = variants[0];
          setSelectedVariant(firstVariant);

          const variantId =
            firstVariant.id ||
            firstVariant.productVariantId ||
            firstVariant.product_variant_id;

          await fetchItemImages(variantId);
          await fetchAvailableItems(variantId);
        }

        await fetchProductReviews();
      } catch (err) {
        console.error("Error fetching product data:", err);
        setError("Failed to load product data");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProductData();
    }
  }, [productId]);

  const fetchProductReviews = async () => {
    try {
      setReviewsLoading(true);
      const reviewsData = await getReviews("product", parseInt(productId));
      setReviews(reviewsData || []);

      if (reviewsData && reviewsData.length > 0) {
        const userIds = [
          ...new Set(reviewsData.map((review) => review.user_id)),
        ];
        const userNames = {};

        await Promise.all(
          userIds.map(async (userId) => {
            try {
              const userData = await getUserById(userId);
              userNames[userId] = userData?.name || `User #${userId}`;
            } catch (error) {
              userNames[userId] = `User #${userId}`;
            }
          })
        );

        setUserNamesCache(userNames);
      }
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

    if (!isLoggedIn) {
      showTemporaryNotification("Please log in to write a review", "error");
      return;
    }

    if (!newReview.comment.trim()) {
      showTemporaryNotification("Please enter a comment", "error");
      return;
    }

    try {
      setSubmittingReview(true);

      // Get user ID from context
      const userIdToUse =
        user.userId || user.id || user.User_ID || user.user_id;

      if (!userIdToUse) {
        showTemporaryNotification(
          "User ID not found. Please log in again.",
          "error"
        );
        return;
      }

      const reviewData = {
        review_type: "product",
        target_id: parseInt(productId),
        user_id: userIdToUse,
        rating: newReview.rating,
        comment: newReview.comment.trim(),
      };

      console.log("Submitting review data:", reviewData);

      await addReview(reviewData);

      // Reset form
      setNewReview({
        rating: 5,
        comment: "",
      });
      setShowReviewForm(false);

      // Refresh reviews
      await fetchProductReviews();

      showTemporaryNotification("Review submitted successfully!", "success");
    } catch (err) {
      console.error("Full error object:", err);
      console.error("Error response:", err.response?.data);
      console.error("Error status:", err.response?.status);

      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to submit review. Please try again.";
      showTemporaryNotification(errorMessage, "error");
    } finally {
      setSubmittingReview(false);
    }
  };

  // Calculate average rating with proper error handling (using camelCase properties)
  const getAverageRating = () => {
    if (!reviews || reviews.length === 0) return 0;

    // Filter out invalid ratings and convert to numbers - using camelCase 'rating'
    const validRatings = reviews
      .map((review) => {
        const rating = Number(review.rating); // Changed from review.Rating to review.rating
        return isNaN(rating) ? 0 : rating;
      })
      .filter((rating) => rating > 0);

    if (validRatings.length === 0) return 0;

    const sum = validRatings.reduce((acc, rating) => acc + rating, 0);
    const average = sum / validRatings.length;

    return isNaN(average) ? 0 : Number(average.toFixed(1));
  };

  // Render star rating with better error handling
  const renderStars = (rating, interactive = false, onRatingChange = null) => {
    const numericRating = Number(rating) || 0;
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`star ${i <= numericRating ? "filled" : ""} ${
            interactive ? "interactive" : ""
          }`}
          onClick={interactive ? () => onRatingChange(i) : undefined}
          style={{
            cursor: interactive ? "pointer" : "default",
            color: i <= numericRating ? "#ffd700" : "#ddd",
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
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  // Get user name from cache (synchronous)
  const getUserDisplayName = (userId) => {
    return userNamesCache[userId] || `User #${userId}`;
  };

  // Fetch available items for a variant and calculate best price
  const fetchAvailableItems = async (variantId) => {
    try {
      console.log("Fetching available items for variant ID:", variantId);
      const items = await getItemsByProductVariantId(variantId);
      setAvailableItems(items || []);
      console.log("Available items fetched:", items);
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
        const imagesResponse = await getItemImagesByItemId(items[0].itemId);
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

  const showTemporaryNotification = (message, type = "success") => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleVariantSelection = async (variant) => {
    console.log("Selected variant:", variant);
    setSelectedVariant(variant);
    // Fetch images and items for the selected variant

    await fetchItemImages(
      variant.id || variant.productVariantId || variant.product_variant_id
    );
    await fetchAvailableItems(
      variant.id || variant.productVariantId || variant.product_variant_id
    );
  };

  const handleFindBestPrice = async () => {
    if (!selectedVariant) {
      showTemporaryNotification(
        "Please select a product variant first",
        "error"
      );
      return;
    }

    if (!bestPriceInfo || !bestPriceInfo.bestPriceItem) {
      showTemporaryNotification(
        "This product variant is not available",
        "error"
      );
      return;
    }

    try {
      // Navigate to the best price item page
      console.log(
        "Navigating to best price item:",
        bestPriceInfo.bestPriceItem
      );
      navigate(`/item/${bestPriceInfo.bestPriceItem.item_id}`);
    } catch (err) {
      console.error("Error navigating to best price:", err);
      showTemporaryNotification(
        "Error finding best price. Please try again.",
        "error"
      );
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

  // Helper function to get store name (you'll need to implement this based on your store data structure)
  const getStoreName = (storeId) => {
    // This is a placeholder - you should replace this with actual store data fetching
    // You might want to create a stores context or fetch store data
    const storeNames = {
      1: "Beauty Store Downtown",
      2: "Cosmetics Corner",
      3: "Glamour Gallery",
      4: "Beauty Boutique",
      5: "Makeup Mart",
      // Add more store mappings as needed
    };

    return storeNames[storeId] || `Store #${storeId}`;
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
                `We couldn't find a product with ID ${productId}. It might have been removed or doesn't exist.`}
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

  const averageRating = getAverageRating();

  return (
    <div className="product-page">
      <NavBar />

      <main className="main-content">
        <div className="product-details-container">
          {showNotification && (
            <div className={`notification ${notificationType}`}>
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
                    {renderStars(Math.round(averageRating))}
                    <span className="rating-value">
                      {averageRating > 0 ? averageRating : "No ratings"} (
                      {reviews.length} review
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
                  {productVariants.map((variant, index) => (
                    <button
                      key={
                        variant.product_variant_id ??
                        `variant-fallback-${index}`
                      }
                      className={`variant-option ${
                        selectedVariant?.product_variant_id ===
                        variant.product_variant_id
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
                            <div key={item.item_id} className="store-item">
                              <div className="store-info">
                                <span className="store-name">
                                  {getStoreName(item.store_id)}
                                </span>
                                <span className="store-location">
                                  {/* You can add store location here if available */}
                                  Store ID: {item.store_id}
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
                              <div className="store-availability-status">
                                <span
                                  className={`availability-badge ${
                                    item.stockQuantity > 0
                                      ? "in-stock"
                                      : "out-of-stock"
                                  }`}
                                >
                                  {item.stockQuantity > 0
                                    ? "In Stock"
                                    : "Out of Stock"}
                                </span>
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
                                  {averageRating > 0 ? averageRating : "0.0"}
                                </span>
                                <div className="rating-stars">
                                  {renderStars(Math.round(averageRating))}
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
                        onClick={() => {
                          if (!isLoggedIn) {
                            showTemporaryNotification(
                              "Please log in to write a review",
                              "error"
                            );
                            return;
                          }
                          setShowReviewForm(!showReviewForm);
                        }}
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
                            <button
                              type="submit"
                              className="submit-review-btn"
                              disabled={submittingReview}
                            >
                              {submittingReview
                                ? "Submitting..."
                                : "Submit Review"}
                            </button>
                            <button
                              type="button"
                              className="cancel-review-btn"
                              onClick={() => setShowReviewForm(false)}
                              disabled={submittingReview}
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
                          <div key={review.review_id} className="review-item">
                            <div className="review-header">
                              <div className="review-rating">
                                {renderStars(review.rating || 0)}
                              </div>
                              <div className="review-date">
                                {formatDate(
                                  review.createdAt || review.created_at
                                )}
                              </div>
                            </div>
                            <div className="review-content">
                              <p>{review.comment || "No comment provided."}</p>
                            </div>
                            <div className="review-author">
                              <span>{getUserDisplayName(review.user_id)}</span>
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
