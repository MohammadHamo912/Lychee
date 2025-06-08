// src/pages/WishlistContainer.jsx
import React, { useState, useEffect } from 'react';
import {
  getWishlist,
  removeFromWishlist
} from '../api/wishlist';
import '../ComponentsCss/WishList.css';
import { useUser } from '../context/UserContext';

const WishlistContainer = () => {
  const { user, addToCart } = useUser();
  const userId = user?.userId;

  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartStatus, setCartStatus] = useState({});

  useEffect(() => {
    if (!userId) {
      setError("User not logged in.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const data = await getWishlist(userId);
        setWishlistItems(data || []);
      } catch (err) {
        setError("Failed to load wishlist.");
        console.error("❌ Error fetching wishlist:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleRemove = async (itemId) => {
    try {
      await removeFromWishlist(userId, itemId);
      setWishlistItems((prev) => prev.filter((item) => item.itemId !== itemId));
    } catch (err) {
      console.error("❌ Error removing item:", err);
    }
  };

  const handleAddToCart = async (item) => {
    try {
      setCartStatus((prev) => ({ ...prev, [item.itemId]: 'loading' }));
      const success = await addToCart(item, 1);
      setCartStatus((prev) => ({
        ...prev,
        [item.itemId]: success ? 'added' : 'error'
      }));

      if (success) {
        setTimeout(() => {
          setCartStatus((prev) => ({ ...prev, [item.itemId]: null }));
        }, 1500);
      }
    } catch (err) {
      setCartStatus((prev) => ({ ...prev, [item.itemId]: 'error' }));
    }
  };

  const formatPrice = (price) => `$${price?.toFixed(2) || "0.00"}`;
  const getImage = (item) => item.imageUrl || "https://placehold.co/150x150?text=No+Image";

  return (
    <div className="wishlist-container">
      <h2>Your Wishlist</h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : wishlistItems.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <ul className="wishlist-list">
          {wishlistItems.map((item, index) => (
            <li key={item.itemId || `fallback-${index}`} className="wishlist-item">
              <img
                src={getImage(item)}
                alt={item.name}
                className="wishlist-item-image"
              />
              <div className="wishlist-item-info">
                <h3 className="wishlist-item-name">{item.name}</h3>
                <p className="wishlist-item-price">{formatPrice(item.price)}</p>

                <div className="wishlist-buttons">
                  <button
                    className="add-cart-btn"
                    disabled={cartStatus[item.itemId] === "loading"}
                    onClick={() => handleAddToCart(item)}
                  >
                    {cartStatus[item.itemId] === "added"
                      ? "✓ Added"
                      : cartStatus[item.itemId] === "loading"
                        ? "Adding..."
                        : "Add to Cart"}
                  </button>
                  <button
                    className="remove-wishlist-btn"
                    onClick={() => handleRemove(item.itemId)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WishlistContainer;
