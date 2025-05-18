import React, { useState } from 'react';
import '../ComponentsCss/ShopManagement.css';
import NavBar from './NavBar';

const dummyShops = [
    {
        id: 1,
        name: 'Trendy Cosmetics',
        owner: 'Sarah Connor',
        email: 'sarah@trendy.com',
        products: [
            { id: 1, name: 'Matte Lipstick', price: '$12' },
            { id: 2, name: 'Hydrating Serum', price: '$25' },
            { id: 3, name: 'BB Cream', price: '$18' },
        ]
    },
    {
        id: 2,
        name: 'Glow Hub',
        owner: 'John Doe',
        email: 'john@glowhub.com',
        products: [
            { id: 1, name: 'Glow Toner', price: '$15' },
            { id: 2, name: 'Night Cream', price: '$22' },
        ]
    },
];

const ShopManagement = () => {
    const [shops] = useState(dummyShops);
    const [selectedShop, setSelectedShop] = useState(null);
    const [search, setSearch] = useState('');

    const handleShopClick = (shop) => {
        setSelectedShop(shop);
        setSearch('');
    };

    const filteredProducts = selectedShop
        ? selectedShop.products.filter(p =>
            p.name.toLowerCase().includes(search.toLowerCase())
        )
        : [];

    return (
        <div className="shop-management-container">
            <div className="top-bar">
                <h2>Shop Management</h2>
            </div>

            {!selectedShop ? (
                <div className="shop-list">
                    {shops.map(shop => (
                        <div
                            key={shop.id}
                            className="shop-card"
                            onClick={() => handleShopClick(shop)}
                        >
                            <h3>{shop.name}</h3>
                            <p><strong>Owner:</strong> {shop.owner}</p>
                            <p><strong>Email:</strong> {shop.email}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="shop-details">
                    <button className="back-button" onClick={() => setSelectedShop(null)}>
                        ⬅ Back to Shops
                    </button>
                    <h3>{selectedShop.name}</h3>
                    <p><strong>Owner:</strong> {selectedShop.owner}</p>
                    <p><strong>Email:</strong> {selectedShop.email}</p>

                    <input
                        className="search-bar"
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <div className="product-list">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map(product => (
                                <div key={product.id} className="product-card">
                                    <p><strong>{product.name}</strong></p>
                                    <p>{product.price}</p>
                                </div>
                            ))
                        ) : (
                            <p className="no-products">No products match your search.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShopManagement;
