import React from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import ReusableCard from "../components/ReusableCard";
import cartIcon from "../images/white-cart-icon.png";
import "../ComponentsCss/ItemCard.css"; // For product-specific styling

const ItemCard = ({ item, onAddToCart }) => {
  const navigate = useNavigate();

  // Use enriched data from the API
  const {
    id,
    name,
    image: imageUrl,
    price,
    description,
    discount,
    category,
    stock,
  } = item;

  // Calculate the final price after discount
  const finalPrice = discount ? price - (price * discount) / 100 : price;

  const handleCardClick = () => {
    navigate(`/item/${id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent card click when clicking the button
    onAddToCart(item);
  };

  const AddToCartButton = (
    <button
      className="item-card-button"
      onClick={handleAddToCart}
      aria-label="Add to cart"
      disabled={stock <= 0}
    >
      <img src={cartIcon} alt="Cart icon" className="cart-icon" />
    </button>
  );

  // Create price element with discount display if applicable
  const PriceElement = (
    <div className="item-card-price-container">
      {discount > 0 && (
        <span className="item-card-original-price">${price.toFixed(2)}</span>
      )}
      <span className={`item-card-price ${discount > 0 ? "discounted" : ""}`}>
        ${finalPrice.toFixed(2)}
      </span>
      {discount > 0 && <span className="item-card-discount">-{discount}%</span>}
    </div>
  );

  // Show out of stock indicator
  const stockIndicator =
    stock <= 0 ? (
      <div className="out-of-stock-indicator">Out of Stock</div>
    ) : null;

  return (
    <ReusableCard
      image={imageUrl}
      imageAlt={name}
      title={name}
      subtitle={category ? `Category: ${category}` : null}
      description={description}
      footerLeft={PriceElement}
      footerRight={AddToCartButton}
      onClick={handleCardClick}
      className={`item-theme ${stock <= 0 ? "out-of-stock" : ""}`}
      overlayContent={stockIndicator}
    />
  );
};

ItemCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    description: PropTypes.string,
    price: PropTypes.number.isRequired,
    discount: PropTypes.number,
    category: PropTypes.string,
    stock: PropTypes.number,
    storeId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }).isRequired,
  onAddToCart: PropTypes.func.isRequired,
};

export default ItemCard;
