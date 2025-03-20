// src/components/Wishlist.jsx
import React from 'react';
import PropTypes from 'prop-types';
import '../ComponentsCss/WishList.css';

const Wishlist = ({ wishlistItems, onRemoveFromWishlist, onViewProduct }) => {
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
                <button
                  className="remove-wishlist-btn"
                  onClick={() => onRemoveFromWishlist(item.id)}
                >
                  Remove
                </button>
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
};

export default Wishlist;
