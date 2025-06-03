import React, { useEffect, useState } from 'react';
import { getWishlist, removeFromWishlist } from '../api/wishlist';
import { useUser } from '../context/UserContext';
import '../ComponentsCss/WishList.css';

const WishlistContainer = () => {
  const { user } = useUser(); // Dynamic user
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !user.userId) {
      console.warn("User not yet loaded.");
      return;
    }

    const fetchWishlist = async () => {
      try {
        console.log("Fetching wishlist for userId:", user.userId);
        const data = await getWishlist(user.userId);
        console.log("Fetched wishlist data:", data);
        setWishlistItems(data);
      } catch (err) {
        console.error("Error fetching wishlist:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [user]);

  const handleRemove = async (productVariantId) => {
    try {
      await removeFromWishlist(user.userId, productVariantId);
      setWishlistItems(prev =>
        prev.filter(item => item.productVariantId !== productVariantId)
      );
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  const handleView = (item) => {
    console.log("Viewing item:", item);
  };

  const handleAddToCart = (item) => {
    alert(`Added ${item.name} to cart`);
    handleRemove(item.productVariantId);
  };

  if (!user || !user.userId) {
    return <p>Loading user...</p>;
  }

  if (loading) {
    return <p>Loading wishlist...</p>;
  }

  return (
    <div className="wishlist-container">
      <h2>Your Wishlist</h2>
      {wishlistItems.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <ul className="wishlist-list">
          {wishlistItems.map((item) => (
            <li key={item.productVariantId} className="wishlist-item">
              <img
                src={item.imageUrl || "https://via.placeholder.com/100"}
                alt={item.name || "Product"}
              />
              <h3 onClick={() => handleView(item)}>{item.name || "Product"}</h3>
              <div className="wishlist-buttons">
                <button className="add-cart-btn" onClick={() => handleAddToCart(item)}>Add to Cart</button>
                <button className="remove-wishlist-btn" onClick={() => handleRemove(item.productVariantId)}>Remove</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WishlistContainer;
