import React from "react";
import { Link } from "react-router-dom";
import ReusableCard from "./ReusableCard";
import "./../ComponentsCss/StoreCard.css";

const StoreCard = ({ store }) => {
  // Create store rating display with stars
  const ratingDisplay = (
    <div>
      <span className="stars">
        {"★".repeat(Math.floor(store.rating))}
        {store.rating % 1 > 0 ? "☆" : ""}
      </span>
      <span>({store.reviewCount} reviews)</span>
    </div>
  );

  // Truncate description if too long
  const truncatedDescription =
    store.description.length > 120
      ? `${store.description.substring(0, 120)}...`
      : store.description;

  // Create category tags
  const categoriesDisplay = (
    <div className="store-categories">
      {store.categories.slice(0, 3).map((category, index) => (
        <span key={index} className="category-tag">
          {category}
        </span>
      ))}
      {store.categories.length > 3 && (
        <span>+{store.categories.length - 3} more</span>
      )}
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
  const footerLeft = <span className="store-location">{store.location}</span>;
  const footerRight = (
    <Link
      to={`/StorePage/${store.id}`}
      className="view-store-btn"
      onClick={(e) => e.stopPropagation()}
    >
      Visit Store
    </Link>
  );

  return (
    <ReusableCard
      image={store.logo}
      imageAlt={`${store.name} logo`}
      title={<>{store.name}</>}
      subtitle={ratingDisplay}
      description={descriptionWithCategories}
      footerLeft={footerLeft}
      footerRight={footerRight}
      onClick={() => (window.location.href = `/StorePage/${store.id}`)}
      data-store-id={store.id}
      className="item-theme"
    />
  );
};

export default StoreCard;
