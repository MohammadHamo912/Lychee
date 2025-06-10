import React from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import ReusableCard from "../components/ReusableCard";
import cartIcon from "../images/white-cart-icon.png";
import "../ComponentsCss/ItemCard.css";

const ItemCard = ({ item, onAddToCart, isAddingToCart, allItems = [] }) => {
  const navigate = useNavigate();

  // Use enriched data from the API
  const {
    id,
    name, // Product name from enriched data
    image: imageUrl,
    price,
    description,
    discount,
    stock,
    currentVariant,
    availableVariants,
    barcode,
    brand,
    storeId,
    store_name,
    final_price,
  } = item;

  const storeName = store_name || "Unknown Store";
  const finalPrice = final_price || price * (1 - discount / 100);

  const productId = currentVariant?.productId;

  // Get categories from other items with the same productId (if needed for display)
  const getProductCategories = () => {
    if (!productId || !allItems.length) return [];

    // Find other items with the same productId that might have category info
    // Since categories aren't in the enriched data, we'll return a placeholder
    // You can either add categories to your enriched endpoint or remove this feature
    return [];
  };

  const categories = getProductCategories();

  const handleCardClick = () => {
    navigate(`/item/${id}`);
  };

  // Create price element with discount display if applicable
  const PriceElement = (
    <div className="item-card-price-container">
      {discount > 0 && (
        <span className="item-card-original-price">${price.toFixed(2)}</span>
      )}
      <span className={`item-card-price ${discount > 0 ? "discounted" : ""}`}>
        ${(finalPrice || price).toFixed(2)}
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

  // Store information using pre-fetched storeName
  const storeIndicator = (
    <div className="store-indicator">
      {stock <= 0
        ? `Out of Stock at ${storeName || "Unknown Store"}`
        : `Available at ${storeName || "Unknown Store"}`}
    </div>
  );

  // Simplified category labels (since categories aren't in enriched data)
  const CategoryLabels = () => {
    // If you want to show categories, you'll need to add them to your enriched endpoint
    // For now, we'll show a simple "Product" label or remove this section
    return null; // Remove category display since it's not in enriched data
  };

  // Subtitle contains brand and store info
  const subtitleContent = (
    <div className="item-subtitle-container">
      <CategoryLabels />
      <span className="item-brand">Brand: {brand || "Unknown Brand"}</span>
      <span className="item-store">Store: {storeName || "Unknown Store"}</span>
    </div>
  );

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent card click when clicking the button
    if (onAddToCart) {
      onAddToCart(item);
    }
  };

  const AddToCartButton = (
    <button
      className={`item-card-button ${isAddingToCart ? "loading" : ""}`}
      onClick={handleAddToCart}
      aria-label="Add to cart"
      disabled={stock <= 0 || isAddingToCart}
    >
      {isAddingToCart ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      ) : (
        <img src={cartIcon} alt="Cart icon" className="cart-icon" />
      )}
    </button>
  );

  return (
    <ReusableCard
      image={imageUrl}
      imageAlt={name}
      title={name} // Product name from enriched data
      subtitle={subtitleContent}
      description={description}
      footerLeft={PriceElement}
      footerRight={AddToCartButton}
      onClick={handleCardClick}
      className={`item-theme ${stock <= 0 ? "out-of-stock" : ""}`}
      overlayContent={storeIndicator}
    >
      {/* Add variant information as children */}
      {VariantInfo}
    </ReusableCard>
  );
};

ItemCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    name: PropTypes.string.isRequired, // Product name from enriched data
    image: PropTypes.string.isRequired,
    description: PropTypes.string,
    brand: PropTypes.string,
    price: PropTypes.number.isRequired,
    discount: PropTypes.number,
    stock: PropTypes.number,
    finalPrice: PropTypes.number, // Pre-calculated final price from enriched data
    storeId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    storeName: PropTypes.string, // Store name from enriched data
    currentVariant: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      productId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      size: PropTypes.string,
      color: PropTypes.string,
    }),
    availableVariants: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        productId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        size: PropTypes.string,
        color: PropTypes.string,
        available: PropTypes.bool,
        availableInSameStore: PropTypes.bool,
      })
    ),
    barcode: PropTypes.string,
  }).isRequired,
  onAddToCart: PropTypes.func.isRequired,
  isAddingToCart: PropTypes.bool,
  allItems: PropTypes.array, // Optional array of all items for cross-referencing
};

ItemCard.defaultProps = {
  isAddingToCart: false,
  allItems: [],
};

export default ItemCard;
