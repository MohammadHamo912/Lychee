import React, { useState, useEffect } from 'react';
import {
    LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from 'recharts';
import { useUser } from '../context/UserContext';
import {
    getStoreByOwnerId,
    updateStore,
    getStoreMetrics,
    getStoreSalesData,
    uploadStoreLogo
} from '../api/stores';
import '../ComponentsCss/ShopOwnerDashboard.css';

const ShopOwnerDashboard = () => {
    const { user } = useUser();
    const [storeInfo, setStoreInfo] = useState(null);
    const [profileForm, setProfileForm] = useState(null);
    const [saveMessage, setSaveMessage] = useState('');
    const [logoFile, setLogoFile] = useState(null);
    const [timeframe, setTimeframe] = useState('7days');
    const [salesData, setSalesData] = useState([]);

    const averageRating = storeInfo?.storeRating || 0;
    const roundedRating = Math.round(averageRating);

    useEffect(() => {
        const fetchStoreAndMetrics = async () => {
            if (!user?.userId) return;

            try {
                const data = await getStoreByOwnerId(user.userId);
                const parsed = {
                    storeId: data.storeId,
                    storeName: data.name,
                    description: data.description || '',
                    addressId: data.addressId,
                    address: {
                        city: data.address?.city || '',
                        street: data.address?.street || '',
                        building: data.address?.building || '',
                    },
                    logoUrl: data.logo_url || '',
                    totalSales: 0,
                    totalOrders: 0,
                    totalProducts: 0,
                    storeRating: 0,
                };
                setStoreInfo(parsed);
                setProfileForm(parsed);

                const metrics = await getStoreMetrics(parsed.storeId);
                setStoreInfo(prev => ({
                    ...prev,
                    totalSales: metrics.totalSales || 0,
                    totalOrders: metrics.totalOrders || 0,
                    totalProducts: metrics.totalProducts || 0,
                    storeRating: metrics.storeRating || 0,
                }));
            } catch (err) {
                console.error("❌ Failed to load store or metrics:", err);
            }
        };
        fetchStoreAndMetrics();
    }, [user]);

    useEffect(() => {
        const fetchSalesChart = async () => {
            if (!storeInfo?.storeId) return;
            try {
                const data = await getStoreSalesData(storeInfo.storeId, timeframe);
                setSalesData(data);
            } catch (err) {
                console.error("❌ Failed to load sales data:", err);
                setSalesData([]);
            }
        };
        fetchSalesChart();
    }, [storeInfo?.storeId, timeframe]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (['city', 'street', 'building'].includes(name)) {
            setProfileForm(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    [name]: value,
                }
            }));
        } else {
            setProfileForm(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogoFile(file);
            const previewUrl = URL.createObjectURL(file);
            setProfileForm(prev => ({ ...prev, logoUrl: previewUrl }));
        }
    };

    const handleSaveProfile = async () => {
        try {
            if (logoFile) {
                const uploaded = await uploadStoreLogo(profileForm.storeId, logoFile);
                profileForm.logoUrl = uploaded.logo_url;
            }

            const payload = {
                storeId: profileForm.storeId,
                name: profileForm.storeName,
                description: profileForm.description,
                logo_url: profileForm.logoUrl,
                shopOwnerId: user.userId,
                addressId: profileForm.addressId,
                address: {
                    city: profileForm.address.city,
                    street: profileForm.address.street,
                    building: profileForm.address.building,
                }
            };

            await updateStore(profileForm.storeId, payload);
            setStoreInfo({ ...profileForm });
            setSaveMessage('✅ Profile updated!');
        } catch (err) {
            console.error("❌ Failed to update store:", err.response?.data || err.message);
            setSaveMessage('❌ Failed to save changes');
        } finally {
            setTimeout(() => setSaveMessage(''), 3000);
        }
    };

    if (!storeInfo || !profileForm) return <p>Loading...</p>;

    return (
        <div className="dashboard-container">
            <div className="dashboard-grid">
                <div className="overview-cards">
                    <div className="overview-card"><h2>Total Sales</h2><p>${storeInfo.totalSales.toFixed(2)}</p></div>
                    <div className="overview-card"><h2>Total Orders</h2><p>{storeInfo.totalOrders}</p></div>
                    <div className="overview-card"><h2>Total Products</h2><p>{storeInfo.totalProducts}</p></div>
                    <div className="overview-card">
                        <h2>Store Rating</h2>
                        <div className="store-rating">
                            <div className="stars">{'★'.repeat(roundedRating)}{'☆'.repeat(5 - roundedRating)}</div>
                            <p>{averageRating.toFixed(1)} / 5</p>
                        </div>
                    </div>
                </div>

                <div className="sales-chart-container">
                    <div className="sales-chart-header">
                        <h2>Sales Overview</h2>
                        <select value={timeframe} onChange={e => setTimeframe(e.target.value)} className="timeframe-select">
                            <option value="7days">Last 7 Days</option>
                            <option value="6months">Last 6 Months</option>
                            <option value="2023">Year: 2023</option>
                            <option value="2024">Year: 2024</option>
                        </select>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={salesData}>
                            <CartesianGrid stroke="#f5f5f5" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="total" stroke="#8B3C5D" strokeWidth={2} activeDot={{ r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="profile-section">
                    <h2>Edit Store Profile</h2>
                    <form className="profile-form" onSubmit={e => e.preventDefault()}>
                        <label>Store Name: <input type="text" name="storeName" value={profileForm.storeName} onChange={handleInputChange} /></label>
                        <label>Description: <textarea name="description" rows="3" value={profileForm.description} onChange={handleInputChange}></textarea></label>
                        <label>Store Logo: <input type="file" accept="image/*" onChange={handleLogoChange} /></label>
                        {profileForm.logoUrl && (
                            <div className="logo-preview">
                                <img src={profileForm.logoUrl} alt="Store Logo" style={{ height: '80px', borderRadius: '8px' }} />
                            </div>
                        )}
                        <button id="saveButton" type="button" onClick={handleSaveProfile}>Save Changes</button>
                        {saveMessage && <p className="save-success-message">{saveMessage}</p>}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ShopOwnerDashboard;
