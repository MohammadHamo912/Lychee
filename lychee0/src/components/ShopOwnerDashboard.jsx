import React, { useState } from 'react';
import '../ComponentsCss/ShopOwnerDashboard.css';

const ShopOwnerDashboard = () => {
    // Dummy store info
    const [storeInfo] = useState({
        storeName: "Awesome Store",
        totalSales: 12345.67,
        totalOrders: 150,
        totalProducts: 50,
    });

    // Dummy recent orders
    const [recentOrders] = useState([
        { id: 101, date: '2024-03-01', total: 49.99 },
        { id: 102, date: '2024-02-28', total: 79.99 },
        { id: 103, date: '2024-02-27', total: 29.99 },
    ]);

    // Dummy products data
    const [products] = useState([
        { id: 1, name: 'Lip Gloss', price: 9.99, stock: 20 },
        { id: 2, name: 'Mascara', price: 19.99, stock: 15 },
        { id: 3, name: 'Foundation', price: 29.99, stock: 10 },
    ]);

    const handleViewOrder = (orderId) => {
        console.log("Viewing order", orderId);
    };

    const handleManageProduct = (productId) => {
        console.log("Managing product", productId);
    };

    return (
        <div className="dashboard-container">
            <h1>Shop Owner Dashboard</h1>

            <div className="dashboard-content">
                <div className="overview-column">
                    <div className="overview-card">
                        <h2>{storeInfo.storeName}</h2>
                        <p>Total Sales: ${storeInfo.totalSales.toFixed(2)}</p>
                        <p>Total Orders: {storeInfo.totalOrders}</p>
                        <p>Total Products: {storeInfo.totalProducts}</p>
                    </div>
                </div>

                <div className="info-column">
                    <div className="section recent-orders">
                        <h2>Recent Orders</h2>
                        <ul>
                            {recentOrders.map((order) => (
                                <li key={order.id} onClick={() => handleViewOrder(order.id)}>
                                    <span className="order-id">Order #{order.id}</span>
                                    <span className="order-date">{order.date}</span>
                                    <span className="order-total">${order.total.toFixed(2)}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="section product-management">
                        <h2>Products</h2>
                        <ul>
                            {products.map((product) => (
                                <li key={product.id} onClick={() => handleManageProduct(product.id)}>
                                    <span className="product-name">{product.name}</span>
                                    <span className="product-price">${product.price.toFixed(2)}</span>
                                    <span className="product-stock">Stock: {product.stock}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShopOwnerDashboard;
