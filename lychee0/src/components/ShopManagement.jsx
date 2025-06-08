import React, { useState, useEffect } from "react";
import "../ComponentsCss/ShopManagement.css";
import { getAllStores } from "../api/stores";
import { getUserById } from "../api/users";
import { getItemsByStoreId } from "../api/items";

const ShopManagement = () => {
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  const [shopItems, setShopItems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingItems, setLoadingItems] = useState(false);
  const [error, setError] = useState(null);
  const [itemsError, setItemsError] = useState(null);
  const [shopOwners, setShopOwners] = useState({});

  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true);
        const storesData = await getAllStores();
        setShops(storesData);

        const ownersData = {};
        for (const shop of storesData) {
          if (shop.shopOwnerId) {
            try {
              const ownerData = await getUserById(shop.shopOwnerId);
              ownersData[shop.shopOwnerId] = ownerData;
            } catch (ownerErr) {
              console.error(`Error fetching owner for shop ${shop.storeId}:`, ownerErr);
              ownersData[shop.shopOwnerId] = {
                name: "Unknown",
                email: "Not available",
              };
            }
          }
        }

        setShopOwners(ownersData);
        setError(null);
      } catch (err) {
        console.error("Error fetching stores:", err);
        setError("Failed to load shops. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  useEffect(() => {
    const fetchShopItems = async () => {
      if (!selectedShop) {
        setShopItems([]);
        return;
      }

      try {
        setLoadingItems(true);
        setItemsError(null);
        console.log(`Fetching items for shop ${selectedShop.storeId}...`);

        const items = await getItemsByStoreId(selectedShop.storeId);
        setShopItems(items);
      } catch (err) {
        console.error(
          `Error fetching items for shop ${selectedShop.storeId}:`,
          err
        );
        setItemsError("Failed to load products for this shop.");
        setShopItems([]);
      } finally {
        setLoadingItems(false);
      }
    };

    fetchShopItems();
  }, [selectedShop]);

  const handleShopClick = (shop) => {
    setSelectedShop(shop);
    setSearch("");
    setItemsError(null);
  };

  const filteredItems = shopItems.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="shop-management-container">
      <div className="top-bar">
        <h2>Shop Management</h2>
      </div>

      {loading ? (
        <div className="loading-state">Loading shops...</div>
      ) : error ? (
        <div className="error-state">{error}</div>
      ) : !selectedShop ? (
        <div className="shop-list">
          {shops.length > 0 ? (
            shops.map((shop) => (
              <div
                key={shop.storeId}
                className="shop-card"
                onClick={() => handleShopClick(shop)}
              >
                <h3>{shop.name}</h3>
                <p>
                  <strong>Owner:</strong>{" "}
                  {shop.shopOwnerId && shopOwners[shop.shopOwnerId]
                    ? shopOwners[shop.shopOwnerId].name
                    : "No owner assigned"}
                </p>
                <p>
                  <strong>Email:</strong>{" "}
                  {shop.shopOwnerId && shopOwners[shop.shopOwnerId]
                    ? shopOwners[shop.shopOwnerId].email
                    : "N/A"}
                </p>
              </div>
            ))
          ) : (
            <p className="no-shops">No shops available.</p>
          )}
        </div>
      ) : (
        <div className="shop-details">
          <button className="back-button" onClick={() => setSelectedShop(null)}>
            ⬅ Back to Shops
          </button>
          <h3>{selectedShop.name}</h3>
          <p>
            <strong>Owner:</strong>{" "}
            {selectedShop.shopOwnerId && shopOwners[selectedShop.shopOwnerId]
              ? shopOwners[selectedShop.shopOwnerId].name
              : "No owner assigned"}
          </p>
          <p>
            <strong>Email:</strong>{" "}
            {selectedShop.shopOwnerId && shopOwners[selectedShop.shopOwnerId]
              ? shopOwners[selectedShop.shopOwnerId].email
              : "N/A"}
          </p>

          <input
            className="search-bar"
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {loadingItems ? (
            <div className="loading-items">Loading products...</div>
          ) : itemsError ? (
            <div className="error-state">{itemsError}</div>
          ) : (
            <div className="product-list">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <div key={item.itemId} className="product-card">
                    <p>
                      <strong>{item.name}</strong>
                    </p>
                    <p>${item.price.toFixed(2)}</p>
                    {item.discount > 0 && (
                      <p className="discount">Discount: {item.discount}%</p>
                    )}
                    <p className="stock">Stock: {item.stock}</p>
                  </div>
                ))
              ) : (
                <p className="no-products">
                  {search
                    ? "No products match your search."
                    : "This shop has no products."}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ShopManagement;