import React, { useState } from "react";
import NavBar from "../components/NavBar";
import ProfilePage from "../components/ProfilePage";
import ShowMyReviews from "../components/ShowMyReviews";
import Wishlist from "../components/WishList";
import ShopOwnerDashboard from "../components/ShopOwnerDashboard.jsx";
import ProductManagement from "../components/ProductManagement";
import OrderManagement from "../components/OrderManagement";
import StoreReviewAndSocial from "../components/StoreReviewAndSocial.jsx";
import UserManagement from "../components/UserManagement";
import ShopApproval from "../components/ShopManagement.jsx";
import DiscountManagement from "../components/DiscountManagement.jsx";
import AdminOverview from "../components/AdminOverview";
import "../PagesCss/Dashboard.css";

// customer , admin, storeOwner
const Dashboard = ({ userRole = "customer" }) => {
  const [activeTab, setActiveTab] = useState("default");

  const getTabsByRole = () => {
    switch (userRole) {
      case "admin":
        return [
          { key: "overview", title: "📊 Overview", content: <AdminOverview /> },
          {
            key: "users",
            title: "👥 User Management",
            content: <UserManagement />,
          },
          {
            key: "shops",
            title: "🛍️ Store Management",
            content: <ShopApproval />, // this is the store management
          },
          {
            key: "orders",
            title: "🧾 Orders",
            content: <OrderManagement role="admin" />,
          },
          {
            key: "discounts",
            title: "🎁 Discount Management",
            content: <DiscountManagement />,
          },
        ];
      case "storeOwner":
        return [
          { key: "profile", title: "👤 Profile", content: <ProfilePage /> },
          {
            key: "dashboard",
            title: "📊 Dashboard",
            content: <ShopOwnerDashboard />,
          },
          {
            key: "products",
            title: "📦 Products",
            content: <ProductManagement />,
          },
          {
            key: "orders",
            title: "🧾 Orders",
            content: <OrderManagement role="storeowner" />,
          },
          {
            key: "reviewsAndSocial",
            title: "🌐 Social",
            content: <StoreReviewAndSocial />,
          },
        ];
      default: // customer
        return [
          { key: "profile", title: "👤 Profile", content: <ProfilePage /> },
          {
            key: "orders",
            title: "📦 My Orders",
            content: <OrderManagement role="customer" />,
          },
          { key: "wishlist", title: "❤️ Wishlist", content: <Wishlist /> },
          {
            key: "reviews",
            title: "⭐ My Reviews",
            content: <ShowMyReviews />,
          },
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
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.title}
            </div>
          ))}
        </aside>

        <main className="dashboard-content">{currentTab.content}</main>
      </div>
    </div>
  );
};

export default Dashboard;
