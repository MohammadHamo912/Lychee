// src/pages/WishlistContainer.jsx
import React, { useState, useEffect } from "react";
import { getWishlist, removeFromWishlist } from "../api/wishlist";
import { getEnrichedItemsByIds } from "../api/items";
import ItemCard from "./ItemCard";
import "../ComponentsCss/WishList.css";
import { useUser } from "../context/UserContext";

const WishlistContainer = () => {
  const { user, addToCart, isAddingToCart } = useUser();
  const userId = user?.userId || user?.id || user?.user_id;

  const [wishlistItems, setWishlistItems] = useState([]);
  const [enrichedItems, setEnrichedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [itemLoadingStates, setItemLoadingStates] = useState({});

  useEffect(() => {
    if (!userId) {
      setError("User not logged in.");
      setLoading(false);
      return;
    }

    const fetchWishlistData = async () => {
      try {
        setLoading(true);
        console.log("WishlistContainer - Fetching wishlist for user:", userId);

        const wishlistData = await getWishlist(userId);
        console.log("WishlistContainer - Raw wishlist data:", wishlistData);

        setWishlistItems(wishlistData || []);

        if (wishlistData && wishlistData.length > 0) {
          const itemIds = [...new Set(wishlistData.map((item) => item.itemId))];
          console.log("WishlistContainer - Unique item IDs:", itemIds);

          const enrichedData = await getEnrichedItemsByIds(itemIds);
          console.log("WishlistContainer - Enriched items data:", enrichedData);

          setEnrichedItems(enrichedData || []);
        } else {
          setEnrichedItems([]);
        }
      } catch (err) {
        console.error(
          "❌ WishlistContainer - Error fetching wishlist data:",
          err
        );
        setError("Failed to load wishlist items.");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistData();
  }, [userId]);

  const handleRemoveFromWishlist = async (itemId) => {
    try {
      console.log("WishlistContainer - Removing item from wishlist:", itemId);

      await removeFromWishlist(userId, itemId);

      // Update local state by removing the item
      setWishlistItems((prev) => prev.filter((item) => item.itemId !== itemId));
      setEnrichedItems((prev) => prev.filter((item) => item.id !== itemId));

      console.log("✅ Item successfully removed from wishlist!");
    } catch (err) {
      console.error("❌ Error removing item from wishlist:", err);
      // You could show a toast/notification here
    }
  };

  const handleAddToCart = async (item) => {
    try {
      console.log("WishlistContainer - Adding item to cart:", item);

      // Set loading state for this specific item
      setItemLoadingStates((prev) => ({ ...prev, [item.id]: true }));

      const success = await addToCart(item, 1);

      if (success) {
        console.log("✅ Item successfully added to cart!");
        // You could show a success message or toast here
      } else {
        console.error("❌ Failed to add item to cart");
      }
    } catch (err) {
      console.error("❌ Error adding item to cart:", err);
    } finally {
      // Clear loading state for this specific item
      setItemLoadingStates((prev) => ({ ...prev, [item.id]: false }));
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="wishlist-container">
        <h2>Your Wishlist</h2>
        <div className="loading-message">
          <p>Loading your wishlist items...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="wishlist-container">
        <h2>Your Wishlist</h2>
        <div className="error-message">
          <p className="error">{error}</p>
        </div>
      </div>
    );
  }

  // Show empty wishlist
  if (enrichedItems.length === 0) {
    return (
      <div className="wishlist-container">
        <h2>Your Wishlist</h2>
        <div className="empty-wishlist">
          <p>Your wishlist is empty.</p>
          <p>Start adding items you love to see them here!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-container">
      <h2>Your Wishlist</h2>
      <div className="wishlist-count">
        <p>
          {enrichedItems.length} item{enrichedItems.length !== 1 ? "s" : ""} in
          your wishlist
        </p>
      </div>

      <div className="wishlist-grid">
        {enrichedItems.map((item) => {
          const isItemLoading = itemLoadingStates[item.id] || false;

          return (
            <div key={item.id} className="wishlist-item-wrapper">
              <ItemCard
                item={item}
                onAddToCart={() => handleAddToCart(item)}
                isAddingToCart={isItemLoading}
                allItems={enrichedItems}
              />

              {/* Add remove from wishlist button overlay */}
              <div className="wishlist-actions">
                <button
                  className="remove-from-wishlist-btn"
                  onClick={() => handleRemoveFromWishlist(item.id)}
                  title="Remove from wishlist"
                >
                  ❤️ Remove from Wishlist
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WishlistContainer;
