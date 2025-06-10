import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "../PagesCss/ItemPage.css";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { getItemById } from "../api/items";
import { useUser } from "../context/UserContext";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../api/wishlist";

const ItemPage = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const { user, addToCart, isAddingToCart } = useUser();

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const itemId = Number(id);
      if (!id || isNaN(itemId)) {
        setError("Invalid item ID");
        setLoading(false);
        return;
      }

      try {
        const data = await getItemById(itemId);
        setItem(data);
        document.title = `${data.name} | Lychee`;

        if (user) {
          const wishlist = await getWishlist(
            user.userId || user.id || user.user_id
          );
          const inWishlist = wishlist.some(
            (w) => w.itemId === itemId || w.itemId === data.itemId
          );
          setIsWishlisted(inWishlist);
        }
      } catch (err) {
        setError("Item not found or could not be loaded.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user]);

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };
  const handleInputQuantity = (e) => {
    const value = Math.max(1, parseInt(e.target.value) || 1);
    setQuantity(value);
  };

  const showTemporaryNotification = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2500);
  };

  const toggleWishlist = async () => {
    if (!user) {
      showTemporaryNotification("Please log in to manage your wishlist.");
      return;
    }

    try {
      if (isWishlisted) {
        await removeFromWishlist(user.userId, item.itemId);
        setIsWishlisted(false);
        showTemporaryNotification("Removed from wishlist");
      } else {
        await addToWishlist(user.userId, item.itemId);
        setIsWishlisted(true);
        showTemporaryNotification("Added to wishlist");
      }
    } catch (error) {
      console.error("Wishlist toggle failed:", error);
      showTemporaryNotification("Failed to update wishlist");
    }
  };

  const handleAddToCart = async () => {
    const success = await addToCart(item, quantity);
    if (success) {
      showTemporaryNotification(
        `${quantity} × ${item.name} added to your cart`
      );
    } else {
      showTemporaryNotification(`Failed to add item to cart`);
    }
  };

  const discountedPrice = item?.discount
    ? (item.price * (1 - item.discount / 100)).toFixed(2)
    : item?.price?.toFixed(2);

  if (loading) {
    return (
      <div className="product-page">
        <NavBar />
        <main className="main-content">
          <p>Loading item...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="product-page">
        <NavBar />
        <main className="main-content">
          <div className="not-found">
            <h2>Item Not Found</h2>
            <p>{error}</p>
            <Link to="/">Back to Shop</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="product-page">
      <NavBar />
      <main className="main-content">
        <div className="product-details-container">
          {showNotification && (
            <div className="notification">{notificationMessage}</div>
          )}

          <div className="product-gallery">
            <div className="main-image-wrapper">
              <img
                src={item.image || "/default-product-image.png"}
                alt={item.name}
                className="product-image"
              />
              {item.discount && <div className="sale-badge">SALE</div>}
              <button
                className={`wishlist-btn ${isWishlisted ? "wishlisted" : ""}`}
                onClick={toggleWishlist}
              >
                {isWishlisted ? "💔 Remove" : "❤️ Wishlist"}
              </button>
            </div>
          </div>

          <div className="product-info-block">
            <div className="product-header">
              <div className="brand-badge">{item.brand}</div>
              <h1 className="product-title">{item.name}</h1>
              <Link to={`/store/${item.storeId}`} className="shop-name-link">
                Sold by: <span>{item.storeName}</span>
              </Link>
              <div className="product-price-container">
                {item.discount > 0 && (
                  <span className="original-price">
                    ${item.price.toFixed(2)}
                  </span>
                )}
                <span className="sale-price">${discountedPrice}</span>
              </div>
            </div>

            <div className="product-actions">
              <div className="quantity-control">
                <button
                  className="quantity-btn"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <input
                  type="number"
                  value={quantity}
                  min="1"
                  onChange={handleInputQuantity}
                  className="quantity-input"
                />
                <button
                  className="quantity-btn"
                  onClick={() => handleQuantityChange(1)}
                >
                  +
                </button>
              </div>

              <button
                className="add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={isAddingToCart}
              >
                {isAddingToCart ? "Adding..." : "Add to Cart"}
              </button>
            </div>

            <div className="product-description">
              <h3>Description</h3>
              <p>{item.description}</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ItemPage;
