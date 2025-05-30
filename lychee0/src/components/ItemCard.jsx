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
    name, // This is now the product name
    image: imageUrl,
    price,
    description,
    discount,
    category,
    stock,
    currentVariant,
    availableVariants,
    barcode,
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

  // Create variant information display
  const VariantInfo = currentVariant && (
    <div className="item-card-variant-info">
      <div className="current-variant">
        <span className="variant-label">Current:</span>
        <span className="variant-details">
          {currentVariant.size !== "default" && (
            <span className="variant-size">{currentVariant.size}</span>
          )}
          {currentVariant.color !== "default" && (
            <span className="variant-color">{currentVariant.color}</span>
          )}
        </span>
      </div>

      {availableVariants && availableVariants.length > 1 && (
        <div className="available-variants">
          <span className="variants-label">Available variants:</span>
          <div className="variants-list">
            {availableVariants
              .filter((variant) => variant.id !== currentVariant.id)
              .slice(0, 3) // Show only first 3 other variants
              .map((variant, index) => (
                <span
                  key={variant.id}
                  className={`variant-tag ${
                    variant.available ? "available" : "unavailable"
                  }`}
                  title={variant.available ? "Available" : "Out of stock"}
                >
                  {variant.size !== "default" && variant.size}
                  {variant.size !== "default" &&
                    variant.color !== "default" &&
                    " - "}
                  {variant.color !== "default" && variant.color}
                </span>
              ))}
            {availableVariants.length > 4 && (
              <span className="more-variants">
                +{availableVariants.length - 4} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );

  // Show out of stock indicator
  const stockIndicator =
    stock <= 0 ? (
      <div className="out-of-stock-indicator">Out of Stock</div>
    ) : null;

  // Create subtitle with category and stock info
  const subtitleContent = (
    <div className="item-subtitle-container">
      {category && <span className="item-category">Category: {category}</span>}
      <span className="item-stock">Stock: {stock}</span>
    </div>
  );

  return (
    <ReusableCard
      image={imageUrl}
      imageAlt={name}
      title={name} // Now displays the product name
      subtitle={subtitleContent}
      description={description}
      footerLeft={PriceElement}
      footerRight={AddToCartButton}
      onClick={handleCardClick}
      className={`item-theme ${stock <= 0 ? "out-of-stock" : ""}`}
      overlayContent={stockIndicator}
    >
      {/* Add variant information as children */}
      {VariantInfo}
    </ReusableCard>
  );
};

ItemCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    name: PropTypes.string.isRequired, // Product name
    image: PropTypes.string.isRequired,
    description: PropTypes.string,
    price: PropTypes.number.isRequired,
    discount: PropTypes.number,
    category: PropTypes.string,
    stock: PropTypes.number,
    storeId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    currentVariant: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      size: PropTypes.string,
      color: PropTypes.string,
    }),
    availableVariants: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        size: PropTypes.string,
        color: PropTypes.string,
        available: PropTypes.bool,
      })
    ),
    barcode: PropTypes.string,
  }).isRequired,
  onAddToCart: PropTypes.func.isRequired,
};

export default ItemCard;
