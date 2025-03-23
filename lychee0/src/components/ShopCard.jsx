import React from "react";
import "../ComponentsCss/ShopCard.css";
import PropTypes from "prop-types";

const ShopCard = ({ shop, onViewShop }) => {
  const { id, name, logoUrl, description } = shop;

  return (
    <div className="shop-card">
      <img className="shop-card-logo" src={logoUrl} alt={`Logo of ${name}`} />
      <div className="shop-card-body">
        <h3 className="shop-card-title">{name}</h3>
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
    description: PropTypes.string.isRequired, // Added description to propTypes
  }).isRequired,
  onViewShop: PropTypes.func.isRequired,
};

export default ShopCard;
