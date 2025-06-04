import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import ReusableCard from "../components/ReusableCard";
import cartIcon from "../images/white-cart-icon.png";
import { getCategoriesByProductId } from "../api/productcategories";
import { getCategoryById } from "../api/categories";
import { getStoreById } from "../api/stores"; // Added import for store API
import "../ComponentsCss/ItemCard.css"; // For product-specific styling

const ItemCard = ({ item, onAddToCart }) => {
  const navigate = useNavigate();

  // Use enriched data from the API, added storeId
  const {
    id,
    name, // This is now the product name
    image: imageUrl,
    price,
    description,
    discount,
    stock,
    currentVariant,
    availableVariants,
    barcode, // need to match it for the find best price
    brand,
    storeId, // Added storeId
  } = item;

  // Extract productId from the current variant
  const productId = currentVariant?.productId;

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [storeName, setStoreName] = useState(""); // Added state for store name
  const [storeLoading, setStoreLoading] = useState(true); // Added state for store loading

  // Fetch categories for this item's product
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);

        if (productId) {
          const productCategories = await getCategoriesByProductId(productId);

          if (productCategories && productCategories.length > 0) {
            const categoryPromises = productCategories.map((pc) =>
              getCategoryById(pc.categoryId)
            );

            const categoryDetails = await Promise.all(categoryPromises);
            setCategories(categoryDetails.filter((cat) => cat !== null));
          } else {
            setCategories([]);
          }
        }
      } catch (error) {
        console.error(
          `Failed to fetch categories for product ${productId}:`,
          error
        );
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    if (productId) {
      fetchCategories();
    } else {
      setCategoriesLoading(false);
    }
  }, [productId]);

  // Fetch store name based on storeId
  useEffect(() => {
    const fetchStore = async () => {
      try {
        setStoreLoading(true);
        if (storeId) {
          const store = await getStoreById(storeId);
          if (store) {
            setStoreName(store.name);
          } else {
            setStoreName("Unknown Store");
          }
        } else {
          setStoreName("No Store");
        }
      } catch (error) {
        console.error(`Failed to fetch store for id ${storeId}:`, error);
        setStoreName("Error Loading Store");
      } finally {
        setStoreLoading(false);
      }
    };

    if (storeId) {
      fetchStore();
    } else {
      setStoreLoading(false);
      setStoreName("No Store");
    }
  }, [storeId]);

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
      disabled={stock <= 0} // Button still uses stock for disabling
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

  // Show store information instead of just stock status
  const storeIndicator = (
    <div className="store-indicator">
      {storeLoading
        ? "Loading store..."
        : stock <= 0
        ? `Out of Stock at ${storeName}`
        : `Available at ${storeName}`}
    </div>
  );

  // Create category labels component
  const CategoryLabels = () => {
    if (categoriesLoading) {
      return (
        <span className="item-category loading">Loading categories...</span>
      );
    }

    if (categories.length === 0) {
      return <span className="item-category no-category">Uncategorized</span>;
    }

    if (categories.length === 1) {
      return (
        <span className="item-category">Category: {categories[0].name}</span>
      );
    } else {
      return (
        <span className="item-category multiple">
          Categories: {categories[0].name}
          {categories.length > 1 && (
            <span className="category-count"> +{categories.length - 1}</span>
          )}
        </span>
      );
    }
  };

  // Subtitle contains brand
  const subtitleContent = (
    <div className="item-subtitle-container">
      <CategoryLabels />
      <span className="item-brand">Brand: {brand || "Unknown Brand"}</span>
      <span className="item-store">Store: {storeName || "Unknown Store"}</span>
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
      className={`item-theme ${stock <= 0 ? "out-of-stock" : ""}`} // Stock still affects styling
      overlayContent={storeIndicator} // Updated to show store info
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
    brand: PropTypes.string,
    price: PropTypes.number.isRequired,
    discount: PropTypes.number,
    stock: PropTypes.number,
    storeId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    currentVariant: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      productId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), // Added productId to variant
      size: PropTypes.string,
      color: PropTypes.string,
    }),
    availableVariants: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        productId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), // Added productId to variant
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
