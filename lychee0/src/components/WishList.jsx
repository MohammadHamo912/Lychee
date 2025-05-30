import React, { useState, useEffect } from 'react';
import {
  getWishlist,
  removeFromWishlist,
} from '../api/wishlist';
import '../ComponentsCss/WishList.css';

const userId = 1; // Replace with dynamic auth later

const WishlistContainer = () => {
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getWishlist(userId);
      setWishlistItems(data);
    };
    fetchData();
  }, []);

  const handleRemove = async (productVariantId) => {
    await removeFromWishlist(userId, productVariantId);
    setWishlistItems(prev => prev.filter(item => item.productVariantId !== productVariantId));
  };

  const handleView = (item) => {
    console.log("Viewing product", item);
  };

  const handleAddToCart = (item) => {
    alert(`Added ${item.name} to cart`);
    handleRemove(item.productVariantId);
  };

  return (
    <div className="wishlist-container">
      <h2>Your Wishlist</h2>
      {wishlistItems.length > 0 ? (
        <ul className="wishlist-list">
          {wishlistItems.map((item) => (
            <li key={item.productVariantId} className="wishlist-item">
              <img src={item.imageUrl || "https://via.placeholder.com/100"} alt={item.name} />
              <div>
                <h3 onClick={() => handleView(item)}>{item.name || "Product"}</h3>
                <button onClick={() => handleAddToCart(item)}>Add to Cart</button>
                <button onClick={() => handleRemove(item.productVariantId)}>Remove</button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>Your wishlist is empty.</p>
      )}
    </div>
  );
};

export default WishlistContainer;
