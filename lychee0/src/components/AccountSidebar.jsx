import React from "react";
import "../ComponentsCss/AccountSidebar.css";

const AccountSidebar = ({ activeTab, setActiveTab }) => {
    return (
        <aside className="sidebar">
            <button onClick={() => setActiveTab("profile")} className={activeTab === "profile" ? "active" : ""}>Profile</button>
            <button onClick={() => setActiveTab("orders")} className={activeTab === "orders" ? "active" : ""}>Orders</button>
            <button onClick={() => setActiveTab("wishlist")} className={activeTab === "wishlist" ? "active" : ""}>Wishlist</button>
            <button onClick={() => setActiveTab("reviews")} className={activeTab === "reviews" ? "active" : ""}>Reviews</button>
            <button className="logout">Logout</button>
        </aside>
    );
};

export default AccountSidebar;
