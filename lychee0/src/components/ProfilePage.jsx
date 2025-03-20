import React, { useState } from 'react';
import '../ComponentsCss/ProfilePage.css';

const dummyOrders = [
    { id: 1, date: '2024-03-01', total: 49.99 },
    { id: 2, date: '2024-02-15', total: 79.50 },
    { id: 3, date: '2024-01-20', total: 22.00 },
];

const ProfilePage = () => {
    const [userData, setUserData] = useState({
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        address: '123 Main Street',
        password: '',
        dob: '2000-01-01',
    });

    const [editing, setEditing] = useState(false);

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        console.log('Updated info:', userData);
        setEditing(false);
    };

    const totalSpending = dummyOrders.reduce((sum, order) => sum + order.total, 0);

    return (
        <div className="profile-page-layout">
            <div className="profile-box">
                <h1>My Profile</h1>

                <div className="profile-field">
                    <label>Full Name</label>
                    <input
                        type="text"
                        name="fullName"
                        value={userData.fullName}
                        onChange={handleChange}
                        disabled={!editing}
                    />
                </div>

                <div className="profile-field">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={userData.email}
                        onChange={handleChange}
                        disabled={!editing}
                    />
                </div>

                <div className="profile-field">
                    <label>Phone Number</label>
                    <input
                        type="text"
                        name="phone"
                        value={userData.phone}
                        onChange={handleChange}
                        disabled={!editing}
                    />
                </div>

                <div className="profile-field">
                    <label>Address</label>
                    <input
                        type="text"
                        name="address"
                        value={userData.address}
                        onChange={handleChange}
                        disabled={!editing}
                    />
                </div>

                <div className="profile-field">
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        value={userData.password}
                        onChange={handleChange}
                        disabled={!editing}
                        placeholder={editing ? 'Enter new password' : '********'}
                    />
                </div>

                <div className="profile-field">
                    <label>Date of Birth</label>
                    <input
                        type="date"
                        name="dob"
                        value={userData.dob}
                        onChange={handleChange}
                        disabled={!editing}
                    />
                </div>

                {editing ? (
                    <button className="profile-btn" onClick={handleSave}>
                        Save Changes
                    </button>
                ) : (
                    <button className="profile-btn" onClick={() => setEditing(true)}>
                        Edit Profile
                    </button>
                )}
            </div>

            <div className="profile-extra-box">
                <div className="spending-box">
                    <h2>Total Spending</h2>
                    <p>${totalSpending.toFixed(2)}</p>
                </div>

                <div className="orders-history-box">
                    <h2>Order History</h2>
                    <ul>
                        {dummyOrders.map((order) => (
                            <li key={order.id}>
                                #{order.id} • {order.date} • ${order.total.toFixed(2)}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
