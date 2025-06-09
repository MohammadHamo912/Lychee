import React, { useState, useEffect } from "react";
import "../ComponentsCss/ShopCard.css";
import PropTypes from "prop-types";
import { getReviews } from "../api/reviews";

const ShopCard = ({ shop, onViewShop }) => {
  const { id, name, logoUrl, description } = shop;
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  // Fetch reviews for this shop
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);
        // Note: Using 'shop' as the review type based on your Review model
        const shopReviews = await getReviews("shop", id);
        setReviews(shopReviews || []);
      } catch (error) {
        console.error(`Failed to fetch reviews for shop ${id}:`, error);
        setReviews([]);
      } finally {
        setReviewsLoading(false);
      }
    };

    if (id) {
      fetchReviews();
    }
  }, [id]);

  // Calculate average rating
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

  const avgRating = calculateAverageRating();
  const reviewCount = reviews.length;

  return (
    <div className="shop-card">
      <img className="shop-card-logo" src={logoUrl} alt={`Logo of ${name}`} />
      <div className="shop-card-body">
        <h3 className="shop-card-title">{name}</h3>

        {/* Rating Section */}
        <div className="shop-rating-section">
          {reviewsLoading ? (
            <div className="shop-rating loading">Loading rating...</div>
          ) : (
            <div className="shop-rating">
              <div className="card-rating">
                {renderStars(parseFloat(avgRating))}
              </div>
              <div className="rating-text">
                {avgRating > 0 ? (
                  <>
                    <span className="rating-value">{avgRating}</span>
                    <span className="review-count">
                      ({reviewCount} reviews)
                    </span>
                  </>
                ) : (
                  <span className="no-rating">No reviews yet</span>
                )}
              </div>
            </div>
          )}
        </div>

        <p className="shop-card-description">{description}</p>
        <button
          className="shop-card-button"
          onClick={() => onViewShop(shop)}
          aria-label={`Browse ${name}`}
        >
          Browse Shop
        </button>
      </div>
    </div>
  );
};

ShopCard.propTypes = {
  shop: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    name: PropTypes.string.isRequired,
    logoUrl: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  onViewShop: PropTypes.func.isRequired,
};

export default ShopCard;
