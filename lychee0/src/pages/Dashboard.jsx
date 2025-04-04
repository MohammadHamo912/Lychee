import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import ProfilePage from "../components/ProfilePage";
import OrdersHistory from "../components/OrderHistory";
import ShowMyReviews from "../components/ShowMyReviews";
import Wishlist from "../components/WishList";
import ShopOwnerDashboard from "../components/ShopOwnerDashboard.jsx";
import ProductManagement from "../components/ProductManagement";
import OrderManagement from "../components/OrderManagement";
import "../PagesCss/Dashboard.css";

const Dashboard = ({ userRole = "storeOwner" }) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("default");

    // Define sidebar + content based on role
    const getTabsByRole = () => {
        switch (userRole) {
            case "admin":
                return [
                    {
                        key: "users",
                        title: "👥 User Management",
                        content: () => navigate("/admin/usermanagement"),
                    },
                    {
                        key: "shops",
                        title: "🛍️ Shop Approval",
                        content: () => navigate("/admin/shopapproval"),
                    },
                    {
                        key: "discounts",
                        title: "🎁 Discount Management",
                        content: () => navigate("/admin/discountmanagment"),
                    },
                ];
            case "storeOwner":
                return [
                    { key: "dashboard", title: "📊 Dashboard", content: <ShopOwnerDashboard /> },
                    { key: "products", title: "📦 Products", content: <ProductManagement /> },
                    { key: "orders", title: "🧾 Orders", content: <OrderManagement /> },
                ];
            default: // customer
                return [
                    { key: "profile", title: "👤 Profile", content: <ProfilePage /> },
                    { key: "orders", title: "📦 My Orders", content: <OrdersHistory /> },
                    { key: "wishlist", title: "❤️ Wishlist", content: <Wishlist /> },
                    { key: "reviews", title: "⭐ My Reviews", content: <ShowMyReviews /> },
                ];
        }
    };

    const tabs = getTabsByRole();
    const currentTab = tabs.find((tab) => tab.key === activeTab) || tabs[0];

    return (
        <div>
            <NavBar userRole={userRole} />
            <div className="dashboard-container">
                <aside className="dashboard-sidebar">
                    <h2 className="sidebar-title">
                        {userRole === "admin"
                            ? "Admin Panel"
                            : userRole === "storeOwner"
                                ? "Store Panel"
                                : "My Account"}
                    </h2>

                    {tabs.map((tab) => (
                        <div
                            key={tab.key}
                            className={`sidebar-tab ${activeTab === tab.key ? "active" : ""}`}
                            onClick={() =>
                                typeof tab.content === "function"
                                    ? tab.content() // navigate if admin
                                    : setActiveTab(tab.key)
                            }
                        >
                            {tab.title}
                        </div>
                    ))}
                </aside>

                <main className="dashboard-content">
                    {typeof currentTab.content === "function" ? null : currentTab.content}
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
