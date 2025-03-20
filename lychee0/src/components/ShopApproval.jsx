import React, { useState } from 'react';
import '../ComponentsCss/ShopApproval.css';

const ShopApproval = () => {
    const [pendingShops, setPendingShops] = useState([
        { id: 1, name: 'Trendy Cosmetics', owner: 'Sarah Connor', email: 'sarah@trendy.com' },
        { id: 2, name: 'Glow Hub', owner: 'John Doe', email: 'john@glowhub.com' },
    ]);

    const handleApprove = (id) => {
        setPendingShops(pendingShops.filter(shop => shop.id !== id));
        alert(`Shop ID ${id} approved!`);
    };

    const handleReject = (id) => {
        setPendingShops(pendingShops.filter(shop => shop.id !== id));
        alert(`Shop ID ${id} rejected.`);
    };

    return (
        <div className="shop-approval-container">
            <h2>Shop Approval Requests</h2>

            {pendingShops.length > 0 ? (
                <div className="shop-list">
                    {pendingShops.map(shop => (
                        <div key={shop.id} className="shop-card">
                            <h3>{shop.name}</h3>
                            <p>Owner: {shop.owner}</p>
                            <p>Email: {shop.email}</p>
                            <div className="shop-actions">
                                <button onClick={() => handleApprove(shop.id)} className="approve">Approve</button>
                                <button onClick={() => handleReject(shop.id)} className="reject">Reject</button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No pending shops at the moment.</p>
            )}
        </div>
    );
};

export default ShopApproval;
