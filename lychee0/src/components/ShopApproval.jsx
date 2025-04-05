import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../ComponentsCss/ShopApproval.css';
import NavBar from './NavBar';

const ShopApproval = () => {
    const navigate = useNavigate();

    const [pendingShops, setPendingShops] = useState([
        { id: 1, name: 'Trendy Cosmetics', owner: 'Sarah Connor', email: 'sarah@trendy.com' },
        { id: 2, name: 'Glow Hub', owner: 'John Doe', email: 'john@glowhub.com' },
    ]);

    const handleApprove = (id) => {
        setPendingShops(prev => prev.filter(shop => shop.id !== id));
        alert(`✅ Shop ID ${id} approved!`);
    };

    const handleReject = (id) => {
        setPendingShops(prev => prev.filter(shop => shop.id !== id));
        alert(`❌ Shop ID ${id} rejected.`);
    };

    return (
        <div className="shop-approval-container">
            <div className="top-bar">
                <h2>🛍️ Shop Approval Requests</h2>
            </div>

            {pendingShops.length > 0 ? (
                <div className="shop-list">
                    {pendingShops.map(shop => (
                        <div key={shop.id} className="shop-card">
                            <h3>{shop.name}</h3>
                            <p><strong>Owner:</strong> {shop.owner}</p>
                            <p><strong>Email:</strong> {shop.email}</p>
                            <div className="shop-actions">
                                <button onClick={() => handleApprove(shop.id)} className="approve">Approve</button>
                                <button onClick={() => handleReject(shop.id)} className="reject">Reject</button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="no-pending">No pending shops at the moment.</p>
            )}
        </div>
    );
};

export default ShopApproval;
