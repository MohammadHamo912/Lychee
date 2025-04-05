// ProductCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import ReusableCard from "./../components/ReusableCard";
import "./../ComponentsCss/ProductCard.css"; // For Product-specific styling

const ProductCard = ({ product, onAction }) => {
  const navigate = useNavigate();
  const { id, name, imageUrl, description, category } = product;

  const handleCardClick = () => {
    navigate(`/product/${id}`);
  };

  const handleAction = (e) => {
    e.stopPropagation(); // Prevent navigation
    onAction(product);
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
      image={imageUrl}
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
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    title: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    category: PropTypes.string,
  }).isRequired,
  onAction: PropTypes.func.isRequired,
};

export default ProductCard;
