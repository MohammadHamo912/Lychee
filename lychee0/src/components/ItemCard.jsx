// ItemCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import ReusableCard from "./../components/ReusableCard";
import cartIcon from "../images/white-cart-icon.png";
import "../ComponentsCss/ItemCard.css"; // For product-specific styling

const ItemCard = ({ item, onAddToCart }) => {
  const navigate = useNavigate();
  const { id, name, imageUrl, price, description, shop_name } = item;

  const handleCardClick = () => {
    navigate(`/item/${id}`);
  };

  const handleAddToCart = (e) => {
    alert("Item Added to cart");
  };

  const AddToCartButton = (
    <button
      className="item-card-button"
      onClick={handleAddToCart}
      aria-label="Add to cart"
    >
      <img src={cartIcon} alt="Cart icon" className="cart-icon" />
    </button>
  );

  const PriceElement = (
    <span className="item-card-price">${price.toFixed(2)}</span>
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
      className="item-theme"
    />
  );
};

ItemCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    name: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    shop_name: PropTypes.string,
  }).isRequired,
  onAddToCart: PropTypes.func.isRequired,
};

export default ItemCard;
