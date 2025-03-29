import React, { useState } from "react";
import NavBar from "../components/NavBar";
import AccountSidebar from "../components/AccountSidebar";
import ProfilePage from "../components/ProfilePage";
import OrdersHistory from "../components/OrderHistory";
import ShowMyReviews from "../components/ShowMyReviews";
import Wishlist from "../components/WishList";
import "../PagesCss/Dashboard.css";
import "../ComponentsCss/ShowMyReviews.css";

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState("profile");
    const renderContent = () => {
        switch (activeTab) {
            case "profile":
                return <ProfilePage />;
            case "orders":
                return <OrdersHistory />;
            case "wishlist":
                return <Wishlist />;
            case "reviews":
                return <ShowMyReviews />;
            default:
                return <ProfilePage />;
        }
    };

    return (
        <div>
            <NavBar />
            <div className="dashboard-container">
                <AccountSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                <div className="dashboard-content">{renderContent()}</div>
            </div>
        </div>
    );
};

export default Dashboard;
