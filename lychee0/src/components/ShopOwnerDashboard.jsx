import React, { useEffect, useState } from 'react';
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
import {
    getStoreByOwnerId,
    getStoreMetrics,
    getStoreReviews,
    getStoreSalesData,
    updateStore,
    uploadStoreLogo,
} from '../api/stores';
import { useUser } from '../context/UserContext';

const ShopOwnerDashboard = () => {
    const { user } = useUser();
    const [storeId, setStoreId] = useState(null);
    const [storeInfo, setStoreInfo] = useState(null);
    const [profileForm, setProfileForm] = useState(null);
    const [saveMessage, setSaveMessage] = useState('');
    const [reviews, setReviews] = useState([]);
    const [salesDataSets, setSalesDataSets] = useState({});
    const [timeframe, setTimeframe] = useState('7days');

    console.log("📦 ShopOwnerDashboard loaded, user:", user);

    useEffect(() => {
        if (!user?.userId) {
            console.log("⛔ user.userId is not defined yet.", user);
            return;
        }

        const loadDashboard = async () => {
            try {
                const store = await getStoreByOwnerId(user.userId);
                console.log("✅ Store response:", store);

                if (!store) {
                    setSaveMessage("No store found for this user.");
                    return;
                }

                setStoreId(store.storeId);
                setStoreInfo(store);
                setProfileForm({
                    name: store.name || '',
                    description: store.description || '',
                    logoUrl: store.logoUrl || '',
                    address: store.address || { city: '', street: '', building: '' },
                });

                const metricsPromise = getStoreMetrics(store.storeId).catch(err => {
                    console.error("❌ getStoreMetrics failed:", err);
                    return {};
                });
                const reviewsPromise = getStoreReviews(store.storeId).catch(err => {
                    console.error("❌ getStoreReviews failed:", err);
                    return [];
                });
                const salesPromise = getStoreSalesData(store.storeId, timeframe).catch(err => {
                    console.error("❌ getStoreSalesData failed:", err);
                    return [];
                });

                const [metrics, fetchedReviews, sales] = await Promise.all([
                    metricsPromise, reviewsPromise, salesPromise,
                ]);

                console.log("ℹ️ Metrics:", metrics);
                console.log("ℹ️ Reviews:", fetchedReviews);
                console.log("ℹ️ Sales:", sales);

                setStoreInfo((prev) => ({
                    ...prev,
                    totalSales: metrics.totalSales || 0,
                    totalOrders: metrics.totalOrders || 0,
                    totalProducts: metrics.totalProducts || 0,
                }));
                setProfileForm((prev) => ({ ...prev, ...metrics }));
                setReviews(fetchedReviews);
                setSalesDataSets((prev) => ({ ...prev, [timeframe]: sales }));
            } catch (err) {
                console.error('Error loading dashboard:', err);
            }
        };

        loadDashboard();
    }, [user?.userId, timeframe]);

    const currentSalesData = salesDataSets[timeframe] || [];

    const averageRating = reviews.length
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;
    const roundedRating = Math.round(averageRating);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (["city", "street", "building"].includes(name)) {
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

    const handleLogoChange = async (e) => {
        const file = e.target.files[0];
        if (!file?.type.startsWith("image/")) {
            alert("Please upload a valid image file.");
            return;
        }
        if (file && storeId) {
            try {
                const uploadedUrl = await uploadStoreLogo(storeId, file);
                setProfileForm((prev) => ({ ...prev, logoUrl: uploadedUrl }));
                setStoreInfo((prev) => ({ ...prev, logoUrl: uploadedUrl }));
            } catch (err) {
                console.error("Error uploading logo:", err);
            }
        }
    };

    const handleSaveProfile = async () => {
        if (!storeId) return alert("Store ID is missing.");

        try {
            const updated = await updateStore(storeId, profileForm);
            setStoreInfo(updated);
            setSaveMessage('Profile updated successfully!');
            setTimeout(() => setSaveMessage(''), 3000);
        } catch (err) {
            console.error("Error updating profile:", err);
            alert("Failed to save profile.");
        }
    };

    if (!storeInfo || !profileForm) return <div style={{ padding: "2rem" }}>Loading...</div>;

    return (
        <div className="dashboard-container">
            <div className="dashboard-grid">
                <div className="overview-cards">
                    <div className="overview-card">
                        <h2>Total Sales</h2>
                        <p>${storeInfo.totalSales?.toFixed(2)}</p>
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
                                {'★'.repeat(roundedRating)}{'☆'.repeat(5 - roundedRating)}
                            </div>
                            <p>{averageRating.toFixed(1)} / 5</p>
                        </div>
                    </div>
                </div>

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

                <div className="profile-section">
                    <h2>Edit Store Profile</h2>
                    <form className="profile-form" onSubmit={(e) => e.preventDefault()}>
                        <label>
                            Store Name:
                            <input
                                type="text"
                                name="name"
                                value={profileForm.name || ''}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            Email:
                            <input
                                type="email"
                                name="email"
                                value={user.email || ''}
                                readOnly
                            />
                        </label>
                        <label>
                            City:
                            <input
                                type="text"
                                name="city"
                                value={profileForm.address?.city || ''}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            Street:
                            <input
                                type="text"
                                name="street"
                                value={profileForm.address?.street || ''}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            Building:
                            <input
                                type="text"
                                name="building"
                                value={profileForm.address?.building || ''}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            Description:
                            <textarea
                                name="description"
                                rows="3"
                                value={profileForm.description || ''}
                                onChange={handleInputChange}
                            ></textarea>
                        </label>
                        <label>
                            Store Logo:
                            <input type="file" accept="image/*" onChange={handleLogoChange} />
                        </label>
                        {profileForm.logoUrl && (
                            <div className="logo-preview">
                                <img
                                    src={profileForm.logoUrl}
                                    alt="Store Logo"
                                    style={{ height: '80px', borderRadius: '8px', marginTop: '10px' }}
                                />
                            </div>
                        )}
                        <button type="button" onClick={handleSaveProfile}>
                            Save Changes
                        </button>
                        {saveMessage && <p className="save-success-message">{saveMessage}</p>}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ShopOwnerDashboard;
