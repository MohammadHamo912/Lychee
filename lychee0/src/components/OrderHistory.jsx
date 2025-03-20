import React from 'react';
import '../ComponentsCss/OrderHistory.css';
import { dummyOrderData } from '../Data/dummyOrderData';

// Component to display the history of orders
const OrdersHistory = ({ orders }) => {
    return (
        <div className="orders-history-container">
            <h2>Order History</h2>
            {orders && orders.length > 0 ? (
                <ul className="orders-history-list">
                    {orders.map((order) => (
                        <li key={order.id} className="orders-history-item">
                            <div className="order-header">
                                <span className="order-id">Order #{order.id}</span>
                                <span className="order-date">{order.date}</span>
                                <span className="order-total">${order.total.toFixed(2)}</span>
                            </div>
                            {order.items && order.items.length > 0 && (
                                <ul className="order-items-list">
                                    {order.items.map((item, index) => (
                                        <li key={index} className="order-item">
                                            <span className="order-item-name">{item.productName}</span> –{' '}
                                            <span className="order-item-quantity">Qty: {item.quantity}</span> –{' '}
                                            <span className="order-item-price">${item.price.toFixed(2)}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No past orders found.</p>
            )}
        </div>
    );
};

// Main OrdersPage component that uses OrdersHistory
const OrdersPage = () => {
    return (
        <div>
            <OrdersHistory orders={dummyOrderData} />
        </div>
    );
};

export default OrdersPage;
