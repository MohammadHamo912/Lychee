import React, { useState, useEffect } from 'react';
import '../ComponentsCss/OrderManagement.css';
import { fetchOrders } from '../api/orders';
import { useUser } from '../context/UserContext'; // Ensure this exists

const OrderManagement = ({ role = 'shopowner' }) => {
    const { user } = useUser(); // Get current user
    const [orders, setOrders] = useState([]);
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        if (!user) return;

        const getOrders = async () => {
            const params = {
                role,
                status: filterStatus !== 'All' ? filterStatus : '',
                query: searchQuery,
                startDate,
                endDate,
            };

            if (role === 'shopowner') {
                params.storeId = user.storeId;
            } else if (role === 'customer') {
                params.userId = user.userId;
            }

            try {
                const data = await fetchOrders(params);
                setOrders(data || []);
            } catch (error) {
                console.error("Error fetching filtered orders:", error);
            }
        };

        getOrders();
    }, [filterStatus, searchQuery, startDate, endDate, role, user]);

    const getSearchPlaceholder = () => {
        if (role === 'admin') return 'Search by customer or store...';
        if (role === 'customer') return 'Search by customer name...';
        return 'Search by store name...';
    };

    const handleCardClick = (order) => setSelectedOrder(order);
    const closeModal = () => setSelectedOrder(null);

    return (
        <div className="order-management-container">
            <h2>Order Management</h2>

            <div className="filter-bar">
                <label htmlFor="statusFilter">Filter by Status:</label>
                <select
                    id="statusFilter"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="All">All</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                </select>

                <input
                    type="text"
                    placeholder={getSearchPlaceholder()}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                />

                <div className="date-group">
                    <label htmlFor="start-date">From:</label>
                    <input
                        type="date"
                        id="start-date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="search-input"
                    />
                </div>

                <div className="date-group">
                    <label htmlFor="end-date">To:</label>
                    <input
                        type="date"
                        id="end-date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="search-input"
                    />
                </div>
            </div>

            <div className="order-grid">
                {orders.map(order => (
                    <div
                        key={`${order.orderId}-${order.createdAt}`}
                        className={`order-card status-${order.status?.toLowerCase()}`}
                        onClick={() => handleCardClick(order)}
                    >
                        <div className="order-header">
                            <h3>Order #{order.orderId}</h3>
                            <span className="status-badge">{order.status}</span>
                        </div>
                        <div className="order-info">
                            <p><strong>Customer:</strong> {order.customerName || 'N/A'}</p>
                            <p><strong>Store:</strong> {order.storeName || 'N/A'}</p>
                            <p><strong>Date:</strong> {order.createdAt?.split('T')[0]}</p>
                            <p><strong>Total:</strong> ${order.totalPrice?.toFixed(2)}</p>
                        </div>
                    </div>
                ))}
            </div>

            {selectedOrder && (
                <div className="order-popup" onClick={closeModal}>
                    <div className="order-popup-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-button" onClick={closeModal}>×</button>
                        <h3>Order #{selectedOrder.orderId} Details</h3>
                        <p><strong>Customer:</strong> {selectedOrder.customerName || 'N/A'}</p>
                        <p><strong>Store:</strong> {selectedOrder.storeName || 'N/A'}</p>
                        <p><strong>Date:</strong> {selectedOrder.createdAt?.split('T')[0]}</p>
                        <p><strong>Status:</strong> {selectedOrder.status}</p>
                        <p><strong>Total:</strong> ${selectedOrder.totalPrice?.toFixed(2)}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderManagement;
