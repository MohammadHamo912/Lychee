import React, { useState } from "react";
import NavBar from "../components/NavBar";
import ShopOwnerDashboard from "../components/ShopOwnerDashboard";
import ProductManagement from "../components/ProductManagement";
import OrderManagement from "../components/OrderManagement";
import "../ComponentsCss/OwnerDashboard.css";

const StoreOwnerDashboardPage = () => {
    const [activeTab, setActiveTab] = useState("dashboard");

    const renderContent = () => {
        switch (activeTab) {
            case "dashboard":
                return <ShopOwnerDashboard />;
            case "products":
                return <ProductManagement />;
            case "orders":
                return <OrderManagement />;
            default:
                return <ShopOwnerDashboard />;
        }
    };

    return (
        <div>
            <NavBar userRole="storeOwner" />

            <div className="owner-dashboard-container">
                <aside className="owner-sidebar">
                    <h2 className="sidebar-title">Store Panel</h2>
                    <div
                        className={`sidebar-tab ${activeTab === "dashboard" ? "active" : ""}`}
                        onClick={() => setActiveTab("dashboard")}
                    >
                        Dashboard
                    </div>
                    <div
                        className={`sidebar-tab ${activeTab === "products" ? "active" : ""}`}
                        onClick={() => setActiveTab("products")}
                    >
                        Products
                    </div>
                    <div
                        className={`sidebar-tab ${activeTab === "orders" ? "active" : ""}`}
                        onClick={() => setActiveTab("orders")}
                    >
                        Orders
                    </div>
                </aside>

                <main className="owner-dashboard-content">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default StoreOwnerDashboardPage;
