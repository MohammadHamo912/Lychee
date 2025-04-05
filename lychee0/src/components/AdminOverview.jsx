import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
    PieChart, Pie, Cell, ResponsiveContainer, Legend
} from 'recharts';
import '../ComponentsCss/AdminOverview.css';

const summaryData = {
    users: 2345,
    shops: 87,
    orders: 1245,
    revenue: 124000,
};

const orderTrends = [
    { date: 'Apr 1', orders: 100 },
    { date: 'Apr 2', orders: 150 },
    { date: 'Apr 3', orders: 120 },
    { date: 'Apr 4', orders: 180 },
    { date: 'Apr 5', orders: 130 },
    { date: 'Apr 6', orders: 200 },
    { date: 'Apr 7', orders: 170 },
];

const orderStatusData = [
    { name: 'Processing', value: 400 },
    { name: 'Shipped', value: 300 },
    { name: 'Delivered', value: 500 },
    { name: 'Cancelled', value: 100 },
];

const COLORS = ['#f0a202', '#3d9df6', '#3cb371', '#e74c3c'];

const recentUsers = [
    { id: 1, name: 'Sarah Connor' },
    { id: 2, name: 'John Doe' },
    { id: 3, name: 'Jane Smith' },
];

const recentShops = [
    { id: 1, name: 'Glow Beauty' },
    { id: 2, name: 'Lux Cosmetics' },
];

const recentOrders = [
    { id: 101, customer: 'Sarah Connor', total: 49.99 },
    { id: 102, customer: 'John Doe', total: 79.99 },
];

const AdminOverview = () => {
    return (
        <div className="admin-overview-container">
            <h2 className="admin-overview-title">📊 Platform Overview</h2>

            <div className="summary-cards">
                <div className="card">👤 Users<br /><span>{summaryData.users}</span></div>
                <div className="card">🛍️ Shops<br /><span>{summaryData.shops}</span></div>
                <div className="card">🧾 Orders<br /><span>{summaryData.orders}</span></div>
                <div className="card">💸 Revenue<br /><span>${summaryData.revenue.toLocaleString()}</span></div>
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
                                fill="#8884d8"
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
                        {recentUsers.map((user) => (
                            <li key={user.id}>{user.name}</li>
                        ))}
                    </ul>
                </div>

                <div className="activity-box">
                    <h4>🛒 New Shops</h4>
                    <ul>
                        {recentShops.map((shop) => (
                            <li key={shop.id}>{shop.name}</li>
                        ))}
                    </ul>
                </div>

                <div className="activity-box">
                    <h4>📦 Recent Orders</h4>
                    <ul>
                        {recentOrders.map((order) => (
                            <li key={order.id}>
                                #{order.id} - {order.customer} - ${order.total.toFixed(2)}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AdminOverview;
