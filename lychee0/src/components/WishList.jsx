// src/components/Wishlist.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '../ComponentsCss/WishList.css';

const Wishlist = ({ wishlistItems, onRemoveFromWishlist, onViewProduct, onAddToCart }) => {
  return (
    <div className="wishlist-container">
      <h2>Your Wishlist</h2>
      {wishlistItems && wishlistItems.length > 0 ? (
        <ul className="wishlist-list">
          {wishlistItems.map((item) => (
            <li key={item.id} className="wishlist-item">
              <img
                className="wishlist-item-image"
                src={item.imageUrl}
                alt={`Image of ${item.name}`}
              />
              <div className="wishlist-item-info">
                <h3
                  className="wishlist-item-name"
                  onClick={() => onViewProduct(item)}
                >
                  {item.name}
                </h3>
                <p className="wishlist-item-price">${item.price.toFixed(2)}</p>
                {item.originalPrice && item.originalPrice > item.price && (
                  <p className="price-drop-alert">
                    Price dropped from ${item.originalPrice.toFixed(2)}!
                  </p>
                )}
                <div className="wishlist-buttons">
                  <button
                    className="add-cart-btn"
                    onClick={() => onAddToCart(item)}
                  >
                    Add to Cart
                  </button>
                  <button
                    className="remove-wishlist-btn"
                    onClick={() => onRemoveFromWishlist(item.id)}
                  >
                    Remove
                  </button>
                </div>
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

Wishlist.propTypes = {
  wishlistItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      name: PropTypes.string.isRequired,
      imageUrl: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      originalPrice: PropTypes.number,
    })
  ).isRequired,
  onRemoveFromWishlist: PropTypes.func.isRequired,
  onViewProduct: PropTypes.func.isRequired,
  onAddToCart: PropTypes.func.isRequired,
};

// === Dummy Wrapper for Demo ===
const WishlistDemo = () => {
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 1,
      name: 'Rose Glow Lipstick',
      imageUrl: 'https://via.placeholder.com/100x100?text=Lipstick',
      price: 12.99,
      originalPrice: 18.99,
    },
    {
      id: 2,
      name: 'Silky Touch Foundation',
      imageUrl: 'https://via.placeholder.com/100x100?text=Foundation',
      price: 24.5,
    },
    {
      id: 3,
      name: 'Blush Palette',
      imageUrl: 'https://via.placeholder.com/100x100?text=Blush',
      price: 14.99,
      originalPrice: 20.0,
    },
  ]);

  const handleRemoveFromWishlist = (id) => {
    setWishlistItems(prev => prev.filter(item => item.id !== id));
  };

  const handleViewProduct = (product) => {
  };

  const handleAddToCart = (product) => {
    alert(`Added to cart: ${product.name}`);
    setWishlistItems(prev => prev.filter(item => item.id !== product.id));
  };

  return (
    <Wishlist
      wishlistItems={wishlistItems}
      onRemoveFromWishlist={handleRemoveFromWishlist}
      onViewProduct={handleViewProduct}
      onAddToCart={handleAddToCart}
    />
  );
};

export default WishlistDemo;
