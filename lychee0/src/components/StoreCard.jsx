import React from "react";
import { Link } from "react-router-dom";
import ReusableCard from "./ReusableCard";
import "./../ComponentsCss/StoreCard.css";

const StoreCard = ({ store }) => {
  // Get the store ID from any of the possible property names
  const storeId = store.storeId || store.id || store.Store_ID;

  // Create store rating display with stars
  const ratingDisplay = (
    <div>
      <span className="stars">
        {"★".repeat(Math.floor(store.rating || 0))}
        {(store.rating || 0) % 1 > 0 ? "☆" : ""}
      </span>
      <span>({store.reviewCount || 0} reviews)</span>
    </div>
  );

  // Truncate description if too long
  const truncatedDescription =
    store.description && store.description.length > 120
      ? `${store.description.substring(0, 120)}...`
      : store.description || "No description available";

  // Create category tags
  const categories = Array.isArray(store.categories) ? store.categories : []; // Default to empty array
  const categoriesDisplay = (
    <div className="store-categories">
      {categories.slice(0, 3).map((category, index) => (
        <span key={index} className="category-tag">
          {category}
        </span>
      ))}
      {categories.length > 3 && <span>+{categories.length - 3} more</span>}
    </div>
  );

  // Combine description and categories
  const descriptionWithCategories = (
    <>
      <p>{truncatedDescription}</p>
      {categoriesDisplay}
    </>
  );

  // Create footer content
  const footerLeft = (
    <span className="store-location">
      {store.location || "Unknown location"}
    </span>
  );
  const footerRight = (
    <Link
      to={`/StorePage/${storeId}`}
      className="view-store-btn"
      onClick={(e) => e.stopPropagation()}
    >
      Visit Store
    </Link>
  );

  return (
    <ReusableCard
      image={store.logo_url}
      imageAlt={`${store.name || "Store"} logo`}
      title={<>{store.name || "Unnamed Store"}</>}
      subtitle={ratingDisplay}
      description={descriptionWithCategories}
      footerLeft={footerLeft}
      footerRight={footerRight}
      onClick={() => (window.location.href = `/storepage/${storeId}`)}
      data-store-id={storeId}
      className="item-theme"
    />
  );
};

export default StoreCard;
