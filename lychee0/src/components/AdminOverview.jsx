import React, { useEffect, useState } from 'react';
import {
    LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
    PieChart, Pie, Cell, ResponsiveContainer, Legend
} from 'recharts';
import '../ComponentsCss/AdminOverview.css';
import {
    getDashboardSummary,
    getOrderTrends,
    getOrderStatusData,
    getRecentUsers,
    getRecentShops,
    getRecentOrders
} from '../api/adminOverview';

const COLORS = ['#f0a202', '#3d9df6', '#3cb371', '#e74c3c'];

const AdminOverview = () => {
    const [summary, setSummary] = useState({});
    const [orderTrends, setOrderTrends] = useState([]);
    const [orderStatusData, setOrderStatusData] = useState([]);
    const [recentUsers, setRecentUsers] = useState([]);
    const [recentShops, setRecentShops] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [
                    summaryRes,
                    trendsRes,
                    statusRes,
                    usersRes,
                    shopsRes,
                    ordersRes
                ] = await Promise.all([
                    getDashboardSummary(),
                    getOrderTrends(),
                    getOrderStatusData(),
                    getRecentUsers(),
                    getRecentShops(),
                    getRecentOrders()
                ]);

                setSummary(summaryRes);
                setOrderTrends(trendsRes);
                setOrderStatusData(statusRes);
                setRecentUsers(usersRes);
                setRecentShops(shopsRes);
                setRecentOrders(ordersRes);
            } catch (err) {
                console.error("Failed to load dashboard data:", err);
                setError("Failed to load data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, []);

    if (loading) return <div className="admin-overview-container"><p>Loading...</p></div>;
    if (error) return <div className="admin-overview-container"><p>{error}</p></div>;

    return (
        <div className="admin-overview-container">
            <h2 className="admin-overview-title">📊 Platform Overview</h2>

            <div className="summary-cards">
                <div className="card">👤 Users<br /><span>{summary.users}</span></div>
                <div className="card">🛍️ Shops<br /><span>{summary.shops}</span></div>
                <div className="card">🧾 Orders<br /><span>{summary.orders}</span></div>
                <div className="card">💸 Revenue<br /><span>${Number(summary.revenue).toLocaleString()}</span></div>
            </div>

            <div className="charts-section">
                <div className="chart-box">
                    <h3>📈 Orders This Week</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={orderTrends}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="orders" stroke="#8B3C5D" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-box">
                    <h3>🧾 Orders by Status</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={orderStatusData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                label
                            >
                                {orderStatusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Legend />
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="activity-section">
                <div className="activity-box">
                    <h4>🆕 New Users</h4>
                    <ul>
                        {recentUsers.map(user => (
                            <li key={user.id}>{user.name}</li>
                        ))}
                    </ul>
                </div>

                <div className="activity-box">
                    <h4>🛒 New Shops</h4>
                    <ul>
                        {recentShops.map(shop => (
                            <li key={shop.id}>{shop.name}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AdminOverview;
