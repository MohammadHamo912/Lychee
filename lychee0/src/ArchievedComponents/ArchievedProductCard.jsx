import React from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import "./ProductCard.css";
import cartIcon from "../images/white-cart-icon.png";

const ArchievedProductCard = ({ product, onAddToCart }) => {
  const navigate = useNavigate();
  const { id, name, imageUrl, price, description, shop_name } = product;

  const handleCardClick = () => {
    navigate(`/product/${id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent navigation
    onAddToCart(product);
  };

  return (
    <div className="product-card" onClick={handleCardClick}>
      <img src={imageUrl} alt={name} className="product-card-image" />

      <div className="product-card-body">
        <h3 className="product-card-title">{name}</h3>
        {shop_name && <p className="product-card-shop">Sold by: {shop_name}</p>}
        <p className="product-card-description">{description}</p>

        <div className="product-card-footer">
          <span className="product-card-price">${price.toFixed(2)}</span>
          <button
            className="product-card-button"
            onClick={handleAddToCart}
            aria-label="Add to cart"
          >
            <img src={cartIcon} alt="Cart icon" className="cart-icon" />
          </button>
        </div>
      </div>
    </div>
  );
};

ProductCard.propTypes = {
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

export default ArchievedProductCard;
