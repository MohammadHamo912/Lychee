import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ReusableCard from "./ReusableCard";
import { getAddressById } from "../api/addresses"; // Import your address API
import "./../ComponentsCss/StoreCard.css";

const StoreCard = ({ store }) => {
  const [address, setAddress] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);

  // Get the store ID from any of the possible property names
  const storeId = store.storeId || store.id || store.Store_ID;

  // Get the address ID from any of the possible property names
  const addressId = store.address_id || store.addressId || store.Address_ID;

  // Fetch address data when component mounts or addressId changes
  useEffect(() => {
    const fetchAddress = async () => {
      if (addressId) {
        setLocationLoading(true);
        try {
          const addressData = await getAddressById(addressId);
          setAddress(addressData);
        } catch (error) {
          console.error(`Failed to fetch address for store ${storeId}:`, error);
          setAddress(null);
        } finally {
          setLocationLoading(false);
        }
      }
    };

    fetchAddress();
  }, [addressId, storeId]);

  // Format address for display
  const formatAddress = (addressData) => {
    if (!addressData) return "Unknown location";

    const parts = [];
    if (addressData.building) parts.push(addressData.building);
    if (addressData.street) parts.push(addressData.street);
    if (addressData.city) parts.push(addressData.city);

    return parts.length > 0 ? parts.join(", ") : "Unknown location";
  };

  // Get location display - prioritize fetched address, fallback to store.location
  const getLocationDisplay = () => {
    if (locationLoading) return "Loading location...";
    if (address) return formatAddress(address);
    return store.location || "Unknown location";
  };

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
    <span className={`store-location ${locationLoading ? "loading" : ""}`}>
      <i className="location-icon">📍</i>
      {getLocationDisplay()}
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
