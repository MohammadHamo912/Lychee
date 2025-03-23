import React from "react";
import "../ComponentsCss/ProductCard.css";
import PropTypes from "prop-types";
import cartIcon from "../images/white-cart-icon.png";

const ProductCard = ({ product, onAddToCart }) => {
  // Destructure product details, including description and shop_name
  const { id, name, imageUrl, price, description, shop_name } = product;

  return (
    <div className="product-card">
      <img
        className="product-card-image"
        src={imageUrl}
        alt={`Image of ${name}`}
      />
      <div className="product-card-body">
        <h3 className="product-card-title">{name}</h3>
        {shop_name && <p className="product-card-shop">Shop: {shop_name}</p>}
        <p className="product-card-description">{description}</p>
        <div className="product-card-footer">
          <p className="product-card-price">${price.toFixed(2)}</p>
          <button
            className="product-card-button"
            onClick={() => onAddToCart(product)}
          >
            <img src={cartIcon} alt="Add to Cart" className="cart-icon" />
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

export default ProductCard;
