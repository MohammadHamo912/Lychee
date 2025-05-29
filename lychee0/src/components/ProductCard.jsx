// ProductCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import ReusableCard from "./../components/ReusableCard";
import "./../ComponentsCss/ProductCard.css"; // For Product-specific styling

const ProductCard = ({ product, onAction }) => {
  const navigate = useNavigate();
  const { productId, name, logo_url, description, category } = product;

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

  const CategoryLabel = category ? (
    <span className="product-card-category">{category}</span>
  ) : null;

  return (
    <ReusableCard
      image={getDirectImageUrl(logo_url)}
      imageAlt={name}
      title={name}
      description={description}
      footerLeft={CategoryLabel}
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
    category: PropTypes.string,
  }).isRequired,
  onAction: PropTypes.func,
};

export default ProductCard;
