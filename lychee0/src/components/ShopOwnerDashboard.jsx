import React, { useState } from 'react';
import '../ComponentsCss/ShopOwnerDashboard.css';

const ShopOwnerDashboard = () => {
    const [storeInfo] = useState({
        storeName: "Awesome Store",
        totalSales: 12345.67,
        totalOrders: 150,
        totalProducts: 50,
    });

    const [recentOrders] = useState([
        { id: 101, date: '2024-03-01', total: 49.99 },
        { id: 102, date: '2024-02-28', total: 79.99 },
        { id: 103, date: '2024-02-27', total: 29.99 },
    ]);

    const [products] = useState([
        { id: 1, name: 'Lip Gloss', price: 9.99, stock: 20 },
        { id: 2, name: 'Mascara', price: 19.99, stock: 4 },
        { id: 3, name: 'Foundation', price: 29.99, stock: 2 },
    ]);

    const handleViewOrder = (orderId) => {
        alert(`Viewing Order #${orderId}`);
    };

    const handleManageProduct = (productId) => {
        alert(`Managing Product #${productId}`);
    };

    return (
        <div className="dashboard-container">
            <h1>Welcome, {storeInfo.storeName} 👋</h1>

            <div className="dashboard-grid">
                <div className="overview-cards">
                    <div className="overview-card">
                        <h2>Total Sales</h2>
                        <p>${storeInfo.totalSales.toFixed(2)}</p>
                    </div>
                    <div className="overview-card">
                        <h2>Total Orders</h2>
                        <p>{storeInfo.totalOrders}</p>
                    </div>
                    <div className="overview-card">
                        <h2>Total Products</h2>
                        <p>{storeInfo.totalProducts}</p>
                    </div>
                </div>

                <div className="details-section">
                    <div className="section">
                        <h2>Products</h2>
                        <ul className="item-list">
                            {products.map((product) => (
                                <li
                                    key={product.id}
                                    onClick={() => handleManageProduct(product.id)}
                                >
                                    <span className="product-name">{product.name}</span>
                                    <span className="product-price">${product.price.toFixed(2)}</span>
                                    <span
                                        className={`product-stock ${product.stock < 5 ? 'low-stock' : ''
                                            }`}
                                    >
                                        Stock: {product.stock}
                                    </span>
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
