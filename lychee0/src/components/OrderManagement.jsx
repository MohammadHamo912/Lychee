import React, { useState } from 'react';
import '../ComponentsCss/OrderManagement.css';

const OrderManagement = () => {
    const [orders, setOrders] = useState([
        { id: 101, customer: 'Sarah Connor', date: '2024-03-01', total: 49.99, status: 'Processing' },
        { id: 102, customer: 'John Doe', date: '2024-02-28', total: 79.99, status: 'Shipped' },
        { id: 103, customer: 'Jane Smith', date: '2024-02-27', total: 29.99, status: 'Delivered' },
    ]);

    const handleStatusChange = (orderId, newStatus) => {
        const updatedOrders = orders.map(order =>
            order.id === orderId ? { ...order, status: newStatus } : order
        );
        setOrders(updatedOrders);
    };

    return (
        <div className="order-management-container">
            <h2>Order Management</h2>
            <div className="order-list">
                {orders.map(order => (
                    <div key={order.id} className="order-card">
                        <div className="order-details">
                            <h3>Order #{order.id}</h3>
                            <p>Customer: {order.customer}</p>
                            <p>Date: {order.date}</p>
                            <p>Total: ${order.total.toFixed(2)}</p>
                        </div>
                        <div className="order-status">
                            <label>Status:</label>
                            <select
                                value={order.status}
                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            >
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderManagement;
