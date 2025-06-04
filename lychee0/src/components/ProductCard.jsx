// ProductCard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import ReusableCard from "./../components/ReusableCard";
import { getCategoriesByProductId } from "../api/productcategories";
import { getCategoryById } from "../api/categories";
import "./../ComponentsCss/ProductCard.css";

const ProductCard = ({ product, onAction }) => {
  const navigate = useNavigate();
  const { productId, name, logo_url, description, brand } = product;

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories for this product
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        // Get product-category relationships
        const productCategories = await getCategoriesByProductId(productId);

        if (productCategories && productCategories.length > 0) {
          // Fetch category details for each relationship
          const categoryPromises = productCategories.map((pc) =>
            getCategoryById(pc.categoryId)
          );

          const categoryDetails = await Promise.all(categoryPromises);
          // Filter out any null results and set categories
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

  // Convert Google Drive sharing URL to direct image URL
  const getDirectImageUrl = (driveUrl) => {
    console.log("Original URL:", driveUrl); // Debug log
    if (driveUrl && driveUrl.includes("drive.google.com")) {
      const fileIdMatch = driveUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (fileIdMatch) {
        const directUrl = `https://drive.google.com/uc?export=view&id=${fileIdMatch[1]}`;
        console.log("Converted URL:", directUrl); // Debug log
        return directUrl;
      }
    }
    console.log("Using original URL:", driveUrl); // Debug log
    return driveUrl;
  };

  const handleCardClick = () => {
    navigate(`/product/${productId}`);
  };

  const handleAction = (e) => {
    alert("Coming Soon");
  };

  const ActionButton = (
    <button className="product-card-button" onClick={handleAction}>
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

    // Show first category, or multiple categories
    if (categories.length === 1) {
      return (
        <span className="product-card-category">{categories[0].name}</span>
      );
    } else {
      // Show first category + count of others
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

  // subtitle contains brand
  const subtitleContent = (
    <div className="product-subtitle-container">
      {brand && <span className="product-brand">Brand: {brand}</span>}
    </div>
  );

  return (
    <ReusableCard
      image={getDirectImageUrl(logo_url)}
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
