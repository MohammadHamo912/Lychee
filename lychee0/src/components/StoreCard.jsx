import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ReusableCard from "./ReusableCard";
import { getAddressById } from "../api/addresses";
import { getReviews } from "../api/reviews";
import "./../ComponentsCss/StoreCard.css";

const StoreCard = ({ store }) => {
  const [address, setAddress] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const storeId = store.store_id;

  const addressId = store.address_id;

  // Fetch address data when component mounts or addressId changes
  useEffect(() => {
    const fetchAddress = async () => {
      if (addressId) {
        setLocationLoading(true);
        try {
          const addressData = await getAddressById(addressId);
          setAddress(addressData);
        } catch (error) {
          console.error(`Failed to fetch address for store ${storeId}:`, error);
          setAddress(null);
        } finally {
          setLocationLoading(false);
        }
      }
    };

    fetchAddress();
  }, [addressId, storeId]);

  // Fetch reviews for this store
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);
        // Using 'shop' as the review type since stores are reviewed as shops
        const storeReviews = await getReviews("shop", storeId);
        setReviews(storeReviews || []);
      } catch (error) {
        console.error(`Failed to fetch reviews for store ${storeId}:`, error);
        setReviews([]);
      } finally {
        setReviewsLoading(false);
      }
    };

    if (storeId) {
      fetchReviews();
    }
  }, [storeId]);

  // Calculate average rating from reviews
  const calculateAverageRating = () => {
    if (!reviews || reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  // Render star rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <span key={i} className="star filled">
            ★
          </span>
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <span key={i} className="star half-filled">
            ★
          </span>
        );
      } else {
        stars.push(
          <span key={i} className="star">
            ☆
          </span>
        );
      }
    }
    return stars;
  };

  // Format address for display
  const formatAddress = (addressData) => {
    if (!addressData) return "Unknown location";

    const parts = [];
    if (addressData.building) parts.push(addressData.building);
    if (addressData.street) parts.push(addressData.street);
    if (addressData.city) parts.push(addressData.city);

    return parts.length > 0 ? parts.join(", ") : "Unknown location";
  };

  // Get location display - prioritize fetched address, fallback to store.location
  const getLocationDisplay = () => {
    if (locationLoading) return "Loading location...";
    if (address) return formatAddress(address);
    return store.location || "Unknown location";
  };

  // Create store rating display with dynamic stars from reviews
  const getRatingDisplay = () => {
    if (reviewsLoading) {
      return (
        <div className="store-rating loading">
          <span className="rating-loading">Loading rating...</span>
        </div>
      );
    }

    const avgRating = calculateAverageRating();
    const reviewCount = reviews.length;

    return (
      <div className="store-rating">
        <div className="stars-container">
          <span className="stars">{renderStars(parseFloat(avgRating))}</span>
          <span className="rating-text">
            {avgRating > 0 ? (
              <>
                <span className="rating-value">{avgRating}</span>
                <span className="review-count">({reviewCount} reviews)</span>
              </>
            ) : (
              <span className="no-rating">No reviews yet</span>
            )}
          </span>
        </div>
      </div>
    );
  };

  // Truncate description if too long
  const truncatedDescription =
    store.description && store.description.length > 120
      ? `${store.description.substring(0, 120)}...`
      : store.description || "No description available";

  // Create category tags
  const categories = Array.isArray(store.categories) ? store.categories : [];
  const categoriesDisplay = (
    <div className="store-categories">
      {categories.slice(0, 3).map((category, index) => (
        <span key={index} className="category-tag">
          {category}
        </span>
      ))}
      {categories.length > 3 && <span>+{categories.length - 3} more</span>}
    </div>
  );

  // Combine description and categories
  const descriptionWithCategories = (
    <>
      <p>{truncatedDescription}</p>
      {categoriesDisplay}
    </>
  );

  // Create footer content
  const footerLeft = (
    <span className={`store-location ${locationLoading ? "loading" : ""}`}>
      <i className="location-icon">📍</i>
      {getLocationDisplay()}
    </span>
  );

  const footerRight = (
    <Link
      to={`/StorePage/${storeId}`}
      className="view-store-btn"
      onClick={(e) => e.stopPropagation()}
    >
      Visit Store
    </Link>
  );

  return (
    <ReusableCard
      image={store.logo_url}
      imageAlt={`${store.name || "Store"} logo`}
      title={<>{store.name || "Unnamed Store"}</>}
      subtitle={getRatingDisplay()}
      description={descriptionWithCategories}
      footerLeft={footerLeft}
      footerRight={footerRight}
      onClick={() => (window.location.href = `/storepage/${storeId}`)}
      data-store-id={storeId}
      className="item-theme"
    />
  );
};

export default StoreCard;
