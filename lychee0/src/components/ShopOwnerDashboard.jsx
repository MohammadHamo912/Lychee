import React, { useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from 'recharts';
import '../ComponentsCss/ShopOwnerDashboard.css';

const ShopOwnerDashboard = () => {
    const [storeInfo, setStoreInfo] = useState({
        storeName: 'Awesome Store',
        email: 'owner@example.com',
        description: 'We sell the best beauty products.',
        address: {
            city: 'Beauty City',
            street: '123 Main St',
            building: 'Block A',
        },
        categories: 'Makeup, Skincare',
        password: 'secret123',
        totalSales: 12345.67,
        totalOrders: 150,
        totalProducts: 50,
    });

    const [profileForm, setProfileForm] = useState({ ...storeInfo });
    const [saveMessage, setSaveMessage] = useState('');

    const [products] = useState([
        { id: 1, name: 'Lip Gloss', price: 9.99, stock: 20 },
        { id: 2, name: 'Mascara', price: 19.99, stock: 4 },
        { id: 3, name: 'Foundation', price: 29.99, stock: 2 },
    ]);

    const [reviews] = useState([
        {
            id: 1,
            productName: 'Shimmering Rose Lip Gloss',
            rating: 4,
            comment: 'Really smooth and glossy. Love the Rose tint!',
            customer: 'Sarah Connor',
            date: '2024-03-01',
        },
        {
            id: 2,
            productName: 'Mascara Max Volume',
            rating: 5,
            comment: 'Amazing volume and lasts all day!',
            customer: 'John Doe',
            date: '2024-02-28',
        },
    ]);

    const averageRating = reviews.length
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;
    const roundedRating = Math.round(averageRating);

    const [timeframe, setTimeframe] = useState('7days');
    const salesDataSets = {
        '7days': [
            { date: 'Apr 1', total: 120 },
            { date: 'Apr 2', total: 220 },
            { date: 'Apr 3', total: 180 },
            { date: 'Apr 4', total: 300 },
            { date: 'Apr 5', total: 250 },
            { date: 'Apr 6', total: 310 },
            { date: 'Apr 7', total: 400 },
        ],
        '6months': [
            { date: 'Nov', total: 3200 },
            { date: 'Dec', total: 4100 },
            { date: 'Jan', total: 3800 },
            { date: 'Feb', total: 3600 },
            { date: 'Mar', total: 4800 },
            { date: 'Apr', total: 5200 },
        ],
        '2023': [
            { date: 'Jan', total: 3100 },
            { date: 'Feb', total: 2900 },
            { date: 'Mar', total: 3500 },
            { date: 'Apr', total: 3000 },
            { date: 'May', total: 4200 },
            { date: 'Jun', total: 4600 },
            { date: 'Jul', total: 3900 },
            { date: 'Aug', total: 4300 },
            { date: 'Sep', total: 4100 },
            { date: 'Oct', total: 4700 },
            { date: 'Nov', total: 4900 },
            { date: 'Dec', total: 5000 },
        ],
        '2024': [
            { date: 'Jan', total: 3900 },
            { date: 'Feb', total: 3700 },
            { date: 'Mar', total: 4200 },
            { date: 'Apr', total: 4400 },
        ],
    };

    const currentSalesData = salesDataSets[timeframe] || [];

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (['city', 'street', 'building'].includes(name)) {
            setProfileForm((prev) => ({
                ...prev,
                address: {
                    ...prev.address,
                    [name]: value,
                },
            }));
        } else {
            setProfileForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSaveProfile = () => {
        setStoreInfo((prev) => ({
            ...prev,
            ...profileForm,
            address: { ...profileForm.address },
        }));
        setSaveMessage('Profile information updated successfully!');
        setTimeout(() => setSaveMessage(''), 3000);
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-grid">
                {/* Overview Cards */}
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
                    <div className="overview-card">
                        <h2>Store Rating</h2>
                        <div className="store-rating">
                            <div className="stars">
                                {'★'.repeat(roundedRating)}
                                {'☆'.repeat(5 - roundedRating)}
                            </div>
                            <p>{averageRating.toFixed(1)} / 5</p>
                        </div>
                    </div>
                </div>

                {/* Sales Chart */}
                <div className="sales-chart-container">
                    <div className="sales-chart-header">
                        <h2>Sales Overview</h2>
                        <select
                            value={timeframe}
                            onChange={(e) => setTimeframe(e.target.value)}
                            className="timeframe-select"
                        >
                            <option value="7days">Last 7 Days</option>
                            <option value="6months">Last 6 Months</option>
                            <option value="2023">Year: 2023</option>
                            <option value="2024">Year: 2024</option>
                        </select>
                    </div>

                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={currentSalesData}>
                            <CartesianGrid stroke="#f5f5f5" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="total"
                                stroke="#8B3C5D"
                                strokeWidth={2}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Profile Edit */}
                <div className="profile-section">
                    <h2>Edit Store Profile</h2>
                    <form className="profile-form" onSubmit={(e) => e.preventDefault()}>
                        <label>
                            Store Name:
                            <input
                                type="text"
                                name="storeName"
                                value={profileForm.storeName}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            Email:
                            <input
                                type="email"
                                name="email"
                                value={profileForm.email}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            City:
                            <input
                                type="text"
                                name="city"
                                value={profileForm.address.city}
                                onChange={handleInputChange}
                                required
                            />
                        </label>
                        <label>
                            Street:
                            <input
                                type="text"
                                name="street"
                                value={profileForm.address.street || ''}
                                onChange={handleInputChange}
                                placeholder="Optional"
                            />
                        </label>
                        <label>
                            Building:
                            <input
                                type="text"
                                name="building"
                                value={profileForm.address.building || ''}
                                onChange={handleInputChange}
                                placeholder="Optional"
                            />
                        </label>
                        <label>
                            Description:
                            <textarea
                                name="description"
                                rows="3"
                                value={profileForm.description}
                                onChange={handleInputChange}
                            ></textarea>
                        </label>
                        <button id='saveButton' type="button" onClick={handleSaveProfile}>
                            Save Changes
                        </button>
                        {saveMessage && (
                            <p className="save-success-message">{saveMessage}</p>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ShopOwnerDashboard;
