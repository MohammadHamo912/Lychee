// src/components/OrderManagement.jsx

import React, { useState, useEffect } from "react";
import "../ComponentsCss/OrderManagement.css";
import {
  fetchOrders,
  fetchOrderItems,
  fetchOrderItemDetailsByStore,
  updateOrderStatus,
} from "../api/orders";
import { useUser } from "../context/UserContext";

const OrderManagement = ({ role = "shopowner", storeId }) => {
  const { user } = useUser();
  const [orders, setOrders] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusUpdateMessage, setStatusUpdateMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getOrders = async () => {
      setLoading(true);
      const params = {
        role,
        status: filterStatus !== "All" ? filterStatus : "",
        query: searchQuery,
        startDate,
        endDate,
      };

      if (role === "shopowner") params.storeId = storeId;
      else if (role === "customer") params.userId = user.user_id;

      try {
        const data = await fetchOrders(params);

        setOrders(data || []);
      } catch (err) {
        console.error("❌ Failed to fetch orders:", err);
        setOrders([]); // Reset orders on error
      } finally {
        setLoading(false);
      }
    };

    getOrders();
  }, [filterStatus, searchQuery, startDate, endDate, role, user]);

  const handleCardClick = async (order) => {
    setSelectedOrder(order);
    setOrderItems([]); // Reset items while loading

    try {
      let items;

      if (role === "shopowner") {
        items = await fetchOrderItemDetailsByStore(
          storeId,
          order.order_id || order.orderId // Handle both possible field names
        );
      } else {
        items = await fetchOrderItems(order.order_id || order.orderId);
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
    const newStatus = e.target.value;
    setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
  };

  const handleStatusUpdate = async () => {
    if (!selectedOrder) return;

    try {
      const id = selectedOrder.order_id || selectedOrder.orderId;

      await updateOrderStatus(id, selectedOrder.status);

      // Update the orders list
      const updated = orders.map((o) =>
        (o.order_id || o.orderId) === id
          ? { ...o, status: selectedOrder.status }
          : o
      );

      setOrders(updated);
      setStatusUpdateMessage("✅ Status updated successfully!");
      setTimeout(() => setStatusUpdateMessage(""), 3000);
    } catch (err) {
      console.error("Failed to update order status:", err);
      setStatusUpdateMessage("❌ Update failed");
      setTimeout(() => setStatusUpdateMessage(""), 3000);
    }
  };

  const getSearchPlaceholder = () => {
    if (role === "admin") return "Search by customer or store...";
    if (role === "shopowner") return "Search by customer...";
    return "";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const formatPrice = (price) => {
    if (price === null || price === undefined) return "0.00";
    return parseFloat(price).toFixed(2);
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

      {loading && <div className="loading">Loading orders...</div>}

      <div className="order-grid">
        {orders.map((order) => (
          <div
            key={order.order_id || order.orderId}
            className={`order-card status-${order.status?.toLowerCase()}`}
            onClick={() => handleCardClick(order)}
          >
            <div className="order-header">
              <h3>Order #{order.order_id || order.orderId}</h3>
              <span className="status-badge">{order.status}</span>
            </div>
            <div className="order-info">
              <p>
                <strong>Date:</strong>{" "}
                {formatDate(order.created_at || order.createdAt)}
              </p>
              <p>
                <strong>Total:</strong> $
                {formatPrice(order.total_price || order.totalPrice)}
              </p>
              {role === "admin" && order.customer_name && (
                <p>
                  <strong>Customer:</strong> {order.customer_name}
                </p>
              )}
              {role === "admin" && order.store_name && (
                <p>
                  <strong>Store:</strong> {order.store_name}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {orders.length === 0 && !loading && (
        <div className="no-orders">No orders found.</div>
      )}

      {selectedOrder && (
        <div className="order-popup" onClick={closeModal}>
          <div
            className="order-popup-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-button" onClick={closeModal}>
              ×
            </button>

            <h3>
              Order #{selectedOrder.order_id || selectedOrder.orderId} Details
            </h3>
            <p>
              <strong>Date:</strong>{" "}
              {formatDate(selectedOrder.created_at || selectedOrder.createdAt)}
            </p>
            <p>
              <strong>Total:</strong> $
              {formatPrice(
                selectedOrder.total_price || selectedOrder.totalPrice
              )}
            </p>

            {role === "admin" ? (
              <div className="status-control">
                <label>Status:</label>
                <select
                  value={selectedOrder.status}
                  onChange={handleStatusChange}
                >
                  <option value="Confirmed">Confirmed</option>
                  <option value="Shipping">Shipping</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
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
                  <li key={i} className="order-item">
                    <p>
                      <strong>Product:</strong>{" "}
                      {item.productName ||
                        item.product_name ||
                        "Unknown Product"}
                    </p>
                    {(item.quantity !== undefined ||
                      item.quantity !== null) && (
                      <p>
                        <strong>Quantity:</strong> {item.quantity}
                      </p>
                    )}
                    <p>
                      <strong>Price:</strong> ${formatPrice(item.price)}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No items found for this order.</p>
            )}

            {role === "admin" && (
              <div className="admin-controls">
                <button
                  className="update-status-btn"
                  onClick={handleStatusUpdate}
                >
                  Update Status
                </button>
                {statusUpdateMessage && (
                  <p className="status-update-message">{statusUpdateMessage}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
