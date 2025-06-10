// ProductCard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import ReusableCard from "./../components/ReusableCard";
import { getCategoriesByProductId } from "../api/productcategories";
import { getCategoryById } from "../api/categories";
import { getReviews } from "../api/reviews";
import "./../ComponentsCss/ProductCard.css";

const ProductCard = ({ product, onAction }) => {
  const navigate = useNavigate();
  const { productId, name, logo_url, description, brand } = product;

  const [categories, setCategories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  // Fetch categories for this product
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const productCategories = await getCategoriesByProductId(productId);

        if (productCategories && productCategories.length > 0) {
          const categoryPromises = productCategories.map((pc) =>
            getCategoryById(pc.categoryId)
          );

          const categoryDetails = await Promise.all(categoryPromises);
          setCategories(categoryDetails.filter((cat) => cat !== null));
        }
      } catch (error) {
        console.error(
          `Failed to fetch categories for product ${productId}:`,
          error
        );
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchCategories();
    }
  }, [productId]);

  // Fetch reviews for this product
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);
        const productReviews = await getReviews("product", productId);
        setReviews(productReviews || []);
      } catch (error) {
        console.error(
          `Failed to fetch reviews for product ${productId}:`,
          error
        );
        setReviews([]);
      } finally {
        setReviewsLoading(false);
      }
    };

    if (productId) {
      fetchReviews();
    }
  }, [productId]);

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

  const handleCardClick = () => {
    navigate(`/product/${productId}`);
  };

  const ActionButton = (
    <button className="product-card-button" onClick={handleCardClick}>
      Find Best Price
    </button>
  );

  // Create category labels component
  const CategoryLabels = () => {
    if (loading) {
      return <span className="product-card-category loading">Loading...</span>;
    }

    if (categories.length === 0) {
      return (
        <span className="product-card-category no-category">Uncategorized</span>
      );
    }

    if (categories.length === 1) {
      return (
        <span className="product-card-category">{categories[0].name}</span>
      );
    } else {
      return (
        <span className="product-card-category multiple">
          {categories[0].name}
          {categories.length > 1 && (
            <span className="category-count"> +{categories.length - 1}</span>
          )}
        </span>
      );
    }
  };

  // Create rating component
  const RatingComponent = () => {
    if (reviewsLoading) {
      return <div className="product-rating loading">Loading rating...</div>;
    }

    const avgRating = calculateAverageRating();
    const reviewCount = reviews.length;

    return (
      <div className="product-rating">
        <div className="card-rating">{renderStars(parseFloat(avgRating))}</div>
        <div className="rating-text">
          {avgRating > 0 ? (
            <>
              <span className="rating-value">{avgRating}</span>
              <span className="review-count">({reviewCount} reviews)</span>
            </>
          ) : (
            <span className="no-rating">No reviews yet</span>
          )}
        </div>
      </div>
    );
  };

  // subtitle contains brand and rating
  const subtitleContent = (
    <div className="product-subtitle-container">
      {brand && <span className="product-brand">Brand: {brand}</span>}
      <RatingComponent />
    </div>
  );

  return (
    <ReusableCard
      image={logo_url}
      imageAlt={name}
      title={name}
      subtitle={subtitleContent}
      description={description}
      footerLeft={<CategoryLabels />}
      footerRight={ActionButton}
      onClick={handleCardClick}
      className="product-theme"
    />
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    productId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
      .isRequired,
    name: PropTypes.string.isRequired,
    logo_url: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    brand: PropTypes.string,
  }).isRequired,
  onAction: PropTypes.func,
};

export default ProductCard;
