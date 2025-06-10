import React, { useState, useEffect } from "react";
import "../ComponentsCss/OrderManagement.css";
import {
  fetchOrders,
  fetchOrderItems,
  fetchOrderItemDetailsByStore,
  updateOrderStatus,
} from "../api/orders";
import { getStoreByOwnerId } from "../api/stores";
import { useUser } from "../context/UserContext";

const OrderManagement = ({ role = "shopowner", store_id: propStoreId }) => {
  const { user } = useUser();
  const [orders, setOrders] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusUpdateMessage, setStatusUpdateMessage] = useState("");
  const [effectiveStoreId, setEffectiveStoreId] = useState(propStoreId ?? null);

  useEffect(() => {
    const fetchStoreId = async () => {
      if (role === "shopowner" && !propStoreId && user?.user_id) {
        try {
          const store = await getStoreByOwnerId(user.user_id);
          console.log("✅ Loaded store for shopowner:", store);
          setEffectiveStoreId(store.store_id);
        } catch (err) {
          console.error("❌ Failed to fetch store ID:", err);
        }
      }
    };
    fetchStoreId();
  }, [user, role, propStoreId]);

  useEffect(() => {
    const getOrders = async () => {
      if (!user || (role === "shopowner" && !effectiveStoreId)) {
        console.warn("⚠️ Skipping fetchOrders: missing user or store ID");
        return;
      }

      const params = {
        role,
        status: filterStatus !== "All" ? filterStatus : "",
        query: searchQuery,
        startDate,
        endDate,
        user_id: role === "customer" ? user.user_id : undefined,
        store_id: role === "shopowner" ? effectiveStoreId : undefined,
      };

      try {
        console.log("📦 Fetching orders with params:", params);
        const data = await fetchOrders(params);
        setOrders(data || []);
      } catch (err) {
        console.error("❌ Failed to fetch orders:", err);
      }
    };

    getOrders();
  }, [
    filterStatus,
    searchQuery,
    startDate,
    endDate,
    role,
    user,
    effectiveStoreId,
  ]);

  const handleCardClick = async (order) => {
    setSelectedOrder(order);
    try {
      let items;
      if (role === "shopowner") {
        items = await fetchOrderItemDetailsByStore(
          effectiveStoreId,
          order.order_id
        );
      } else {
        items = await fetchOrderItems(order.order_id);
      }
      setOrderItems(items || []);
    } catch (err) {
      console.error("❌ Error loading order items:", err.message);
      setOrderItems([]);
    }
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setOrderItems([]);
    setStatusUpdateMessage("");
  };

  const handleStatusChange = (e) => {
    setSelectedOrder((prev) => ({ ...prev, status: e.target.value }));
  };

  const handleStatusUpdate = async () => {
    try {
      await updateOrderStatus(selectedOrder.order_id, selectedOrder.status);
      setOrders((prev) =>
        prev.map((o) =>
          o.order_id === selectedOrder.order_id
            ? { ...o, status: selectedOrder.status }
            : o
        )
      );
      setStatusUpdateMessage("✅ Status updated!");
      setTimeout(() => setStatusUpdateMessage(""), 3000);
    } catch (err) {
      console.error("❌ Failed to update order status:", err);
      setStatusUpdateMessage("❌ Update failed");
    }
  };

  const getSearchPlaceholder = () => {
    if (role === "admin") return "Search by customer or store...";
    if (role === "shopowner") return "Search by customer...";
    return "";
  };

  return (
    <div className="order-management-container">
      <h2>Order Management</h2>

      <div className="filter-bar">
        <label>Status:</label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Shipping">Shipping</option>
          <option value="Delivered">Delivered</option>
        </select>

        {role !== "customer" && (
          <input
            type="text"
            className="search-input"
            placeholder={getSearchPlaceholder()}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        )}

        <div className="date-group">
          <label>From:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="date-group">
          <label>To:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      <div className="order-grid">
        {orders.map((order) => (
          <div
            key={order.order_id}
            className={`order-card status-${order.status?.toLowerCase()}`}
            onClick={() => handleCardClick(order)}
          >
            <div className="order-header">
              <h3>Order #{order.order_id}</h3>
              <span className="status-badge">{order.status}</span>
            </div>
            <div className="order-info">
              <p>
                <strong>Date:</strong> {order.created_at?.split("T")[0]}
              </p>
              <p>
                <strong>Total:</strong> ${order.total_price?.toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {selectedOrder && (
        <div className="order-popup" onClick={closeModal}>
          <div
            className="order-popup-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-button" onClick={closeModal}>
              ×
            </button>

            <h3>Order #{selectedOrder.order_id} Details</h3>
            <p>
              <strong>Date:</strong>{" "}
              {selectedOrder.created_at?.split("T")[0]}
            </p>
            <p>
              <strong>Total:</strong>{" "}
              ${selectedOrder.total_price?.toFixed(2)}
            </p>

            {role === "admin" ? (
              <div>
                <label>Status:</label>
                <select
                  value={selectedOrder.status}
                  onChange={handleStatusChange}
                >
                  <option value="Confirmed">Confirmed</option>
                  <option value="Shipping">Shipping</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            ) : (
              <p>
                <strong>Status:</strong> {selectedOrder.status}
              </p>
            )}

            <h4>Items:</h4>
            {orderItems.length > 0 ? (
              <ul className="order-items-list">
                {orderItems.map((item, i) => (
                  <li key={i}>
                    <p>
                      <strong>Product:</strong> {item.productName}
                    </p>
                    {item.quantity !== undefined && (
                      <p>
                        <strong>Quantity:</strong> {item.quantity}
                      </p>
                    )}
                    <p>
                      <strong>Price:</strong> ${item.price?.toFixed(2)}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No items found.</p>
            )}

            {role === "admin" && (
              <>
                <button
                  className="update-status-btn"
                  onClick={handleStatusUpdate}
                >
                  Update Status
                </button>
                {statusUpdateMessage && (
                  <p className="status-update-message">
                    {statusUpdateMessage}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
