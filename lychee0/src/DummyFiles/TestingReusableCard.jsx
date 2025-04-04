// ProductCard.js
import React from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import ReusableCard from "./../components/ReusableCard";
import cartIcon from "../images/white-cart-icon.png";
import "./ProductCard.css"; // For product-specific styling

const TestingProductCard = ({ product, onAddToCart }) => {
  const navigate = useNavigate();
  const { id, name, imageUrl, price, description, shop_name } = product;

  const handleCardClick = () => {
    navigate(`/product/${id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent navigation
    onAddToCart(product);
  };

  const AddToCartButton = (
    <button
      className="product-card-button"
      onClick={handleAddToCart}
      aria-label="Add to cart"
    >
      <img src={cartIcon} alt="Cart icon" className="cart-icon" />
    </button>
  );

  const PriceElement = (
    <span className="product-card-price">${price.toFixed(2)}</span>
  );

  return (
    <ReusableCard
      image={imageUrl}
      imageAlt={name}
      title={name}
      subtitle={shop_name ? `Sold by: ${shop_name}` : null}
      description={description}
      footerLeft={PriceElement}
      footerRight={AddToCartButton}
      onClick={handleCardClick}
      className="product-theme"
    />
  );
};

TestingProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    name: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    shop_name: PropTypes.string,
  }).isRequired,
  onAddToCart: PropTypes.func.isRequired,
};

export default TestingProductCard;
