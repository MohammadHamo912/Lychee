import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../ComponentsCss/StorePage.css";
import ItemCard from "../components/ItemCard";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
// Import API functions
import { getStoreById } from "../api/stores.js";
import { getItemsByStoreId } from "../api/items.js";
import { useUser } from "../context/UserContext";
import { getAddressById } from "../api/addresses.js";

const StorePage = () => {
  const { storeId } = useParams();
  const [store, setStore] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [search, setSearch] = useState("");
  const [viewingItem, setViewingItem] = useState(null);
  const [location, setLocation] = useState("Loading location...");

  const { addToCart, isAddingToCart } = useUser();

  const categories = ["Skincare", "Makeup", "Accessories", "Fragrances"];

  const formatAddress = (addressData) => {
    if (!addressData) return "Location unknown";

    const parts = [];
    if (addressData.building) parts.push(addressData.building);
    if (addressData.street) parts.push(addressData.street);
    if (addressData.city) parts.push(addressData.city);

    return parts.length > 0 ? parts.join(", ") : "Location unknown";
  };

  // Fetch store data from API
  useEffect(() => {
    fetchStoreData();
  }, [storeId]);

  // Fetch store location when store data is loaded
  useEffect(() => {
    if (store && store.addressId) {
      fetchStoreLocation();
    }
  }, [store]);

  const fetchStoreData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch store details
      const storeData = await getStoreById(storeId);
      setStore(storeData);

      // Fetch products for this store
      const itemsData = await getItemsByStoreId(storeId);
      setItems(itemsData || []);
    } catch (err) {
      console.error("Error loading store data:", err);
      setError("Failed to load store information. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchStoreLocation = async () => {
    try {
      // Fetch store address details
      const locationData = await getAddressById(store.addressId);
      console.log("Store location data:", locationData);

      // Format the address properly
      const formattedLocation = formatAddress(locationData);
      setLocation(formattedLocation);
    } catch (err) {
      console.error("Error loading store location:", err);
      setLocation("Location unavailable");
    }
  };

  // Filter products based on category selection and search term
  const filteredItems = items.filter((item) => {
    const matchesCategory = filter === "all" || item.category === filter;
    const matchesSearch =
      !search ||
      (item.name && item.name.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Sort products based on selection
  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1;
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      default:
        return 0;
    }
  });

  // Handle add to cart function
  const handleAddToCart = async (item) => {
    const success = await addToCart(item);
    if (success) {
      console.log(`${item.name} added to cart successfully!`);
    } else {
      console.error(`Failed to add ${item.name} to cart`);
    }
  };

  return (
    <div className="site-wrapper">
      {/* NavBar component at the top */}
      <NavBar />

      {/* Main content area */}
      <main className="site-content">
        {loading ? (
          <div className="store-loading">
            <div className="loading-spinner"></div>
            <p>Loading store...</p>
          </div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : !store ? (
          <div className="not-found">Store not found</div>
        ) : (
          <div className="store-page section">
            <div className="store-header">
              <div className="store-info-container container">
                <div className="store-info">
                  <div className="store-logo-container">
                    <img
                      src={store.logo_url}
                      alt={`${store.name} logo`}
                      className="store-logo"
                    />
                  </div>

                  <div className="store-details">
                    <h1 className="store-name">
                      {store.name}
                      {store.isVerified && (
                        <span className="verified-badge">
                          <span className="verified-icon">✓</span> Verified
                        </span>
                      )}
                    </h1>

                    <div className="store-meta">
                      <div className="store-meta-item">
                        <span className="meta-icon">📍</span>
                        <div className="store-location">{location}</div>
                      </div>

                      <div className="store-meta-item">
                        <span className="meta-icon">🕒</span>
                        <div>
                          Since {store?.createdAt?.split("T")[0] || "N/A"}
                        </div>
                      </div>
                    </div>

                    <p className="store-description">
                      {store.description || "No description available"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="store-content container">
              <div className="store-filters">
                <div className="category-filters">
                  <h3>Categories</h3>
                  <div className="filter-options">
                    <button
                      className={`filter-btn ${filter === "all" ? "active" : ""
                        }`}
                      onClick={() => setFilter("all")}
                    >
                      All Items
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category}
                        className={`filter-btn ${filter === category ? "active" : ""
                          }`}
                        onClick={() => setFilter(category)}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="search-container">
                  <input
                    type="text"
                    placeholder="Search items..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="search-input"
                  />
                </div>

                <div className="sort-options">
                  <label htmlFor="sort-select">Sort by:</label>
                  <select
                    id="sort-select"
                    className="sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="newest">Newest</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                  </select>
                </div>
              </div>

              <div className="products-section">
                <h2 className="products-heading">
                  {filter === "all" ? "All Items" : filter}
                  <span className="product-count">({sortedItems.length})</span>
                </h2>

                {sortedItems.length === 0 ? (
                  <p className="no-products">
                    No items available in this category.
                  </p>
                ) : (
                  <div className="product-grid">
                    {sortedItems.map((item) => (
                      <ItemCard
                        key={item.id || item.itemId}
                        item={item}
                        onAddToCart={handleAddToCart}
                        onViewDetails={() => setViewingItem(item)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Product Details Modal */}
        {viewingItem && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>{viewingItem.name}</h2>
              <div className="modal-product-details">
                {viewingItem.image && (
                  <img
                    src={viewingItem.image}
                    alt={viewingItem.name}
                    className="modal-product-image"
                  />
                )}
                <div className="modal-product-info">
                  <p className="modal-product-price">
                    <strong>Price:</strong> $
                    {viewingItem.price?.toFixed(2) || "N/A"}
                  </p>
                  <p>
                    <strong>Category:</strong>{" "}
                    {viewingItem.category || "Uncategorized"}
                  </p>
                  <p>
                    <strong>Description:</strong>{" "}
                    {viewingItem.description || "No description available"}
                  </p>
                  {viewingItem.stock !== undefined && (
                    <p>
                      <strong>In Stock:</strong> {viewingItem.stock}
                    </p>
                  )}
                  {viewingItem.isNew && (
                    <p className="new-product-badge">New Arrival</p>
                  )}
                  <button
                    className="add-to-cart-btn"
                    onClick={() => {
                      handleAddToCart(viewingItem);
                      setViewingItem(null);
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
              <button
                className="close-button"
                onClick={() => setViewingItem(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer component at the bottom */}
      <Footer />
    </div>
  );
};

export default StorePage;
