import React, { useState } from 'react';
import '../ComponentsCss/OrderManagement.css';

const OrderManagement = ({ role = 'storeowner' }) => {
    const [orders, setOrders] = useState([
        {
            id: 101,
            customer: 'Sarah Connor',
            store: 'Glow Beauty',
            date: '2024-03-01',
            total: 49.99,
            status: 'Processing',
            items: [
                { name: 'Lip Gloss', qty: 2, price: 9.99 },
                { name: 'Mascara', qty: 1, price: 29.99 },
            ]
        },
        {
            id: 102,
            customer: 'John Doe',
            store: 'Lux Cosmetics',
            date: '2024-02-28',
            total: 79.99,
            status: 'Shipped',
            items: [
                { name: 'Foundation', qty: 1, price: 39.99 },
                { name: 'Eyeliner', qty: 2, price: 19.99 },
            ]
        },
        {
            id: 103,
            customer: 'Jane Smith',
            store: 'Glow Beauty',
            date: '2024-02-27',
            total: 29.99,
            status: 'Delivered',
            items: [
                { name: 'Perfume Mini', qty: 1, price: 29.99 },
            ]
        },
    ]);

    const [filterStatus, setFilterStatus] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);

    const handleStatusChange = (orderId, newStatus) => {
        if (role !== 'storeowner') return;
        const updated = orders.map(order =>
            order.id === orderId ? { ...order, status: newStatus } : order
        );
        setOrders(updated);
    };

    const handleCardClick = (order) => setSelectedOrder(order);
    const closeModal = () => setSelectedOrder(null);

    const getSearchPlaceholder = () => {
        if (role === 'admin') return 'Search by customer or store...';
        if (role === 'storeowner') return 'Search by customer name...';
        return 'Search by store name...';
    };

    const filteredOrders = orders.filter(order => {
        const matchesStatus = filterStatus === 'All' || order.status === filterStatus;
        const query = searchQuery.toLowerCase();

        let matchesSearch = false;
        if (role === 'admin') {
            matchesSearch =
                order.customer.toLowerCase().includes(query) ||
                order.store.toLowerCase().includes(query);
        } else if (role === 'storeowner') {
            matchesSearch = order.customer.toLowerCase().includes(query);
        } else if (role === 'customer') {
            matchesSearch = order.store.toLowerCase().includes(query);
        }

        const orderDate = new Date(order.date);
        const afterStart = !startDate || orderDate >= new Date(startDate);
        const beforeEnd = !endDate || orderDate <= new Date(endDate);

        return matchesStatus && matchesSearch && afterStart && beforeEnd;
    });

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

                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="search-input"
                    title="Start Date"
                />

                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="search-input"
                    title="End Date"
                />
            </div>

            <div className="order-grid">
                {filteredOrders.map(order => (
                    <div
                        key={order.id}
                        className={`order-card status-${order.status.toLowerCase()}`}
                        onClick={() => handleCardClick(order)}
                    >
                        <div className="order-header">
                            <h3>Order #{order.id}</h3>
                            <span className="status-badge">{order.status}</span>
                        </div>
                        <div className="order-info">
                            <p><strong>Customer:</strong> {order.customer}</p>
                            <p><strong>Store:</strong> {order.store}</p>
                            <p><strong>Date:</strong> {order.date}</p>
                            <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
                        </div>

                        {role === 'storeowner' && (
                            <div className="order-status">
                                <label htmlFor={`status-${order.id}`}>Update Status:</label>
                                <select
                                    id={`status-${order.id}`}
                                    value={order.status}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                >
                                    <option value="Processing">Processing</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {selectedOrder && (
                <div className="order-popup" onClick={closeModal}>
                    <div className="order-popup-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-button" onClick={closeModal}>×</button>
                        <h3>Order #{selectedOrder.id} Details</h3>
                        <p><strong>Customer:</strong> {selectedOrder.customer}</p>
                        <p><strong>Store:</strong> {selectedOrder.store}</p>
                        <p><strong>Date:</strong> {selectedOrder.date}</p>
                        <p><strong>Status:</strong> {selectedOrder.status}</p>
                        <p><strong>Total:</strong> ${selectedOrder.total.toFixed(2)}</p>
                        <h4>Items Ordered:</h4>
                        <ul>
                            {selectedOrder.items.map((item, idx) => (
                                <li key={idx}>
                                    <span className="name">{item.name}</span> |
                                    <span className="qty"> Qty: {item.qty}</span> |
                                    <span className="price"> ${item.price.toFixed(2)}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderManagement;
