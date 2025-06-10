// src/pages/Dashboard.jsx

import React, { useEffect, useState } from "react";
import "../PagesCss/Dashboard.css";
import { useUser } from "../context/UserContext";
import { getStoreByOwnerId } from "../api/stores";

// Components by role
import NavBar from "../components/NavBar";
import ProfilePage from "../components/ProfilePage";
import ShowMyReviews from "../components/ShowMyReviews";
import Wishlist from "../components/WishList";
import ShopOwnerDashboard from "../components/ShopOwnerDashboard";
import OrderManagement from "../components/OrderManagement";
import UserManagement from "../components/UserManagement";
import ShopApproval from "../components/ShopManagement";
import DiscountManagement from "../components/DiscountManagement";
import AdminOverview from "../components/AdminOverview";
import ItemManagement from "../components/ItemManagement";

const Dashboard = () => {
  const { user } = useUser(); 
  const userRole = user?.role || "customer";
  const [activeTab, setActiveTab] = useState("default");
  const [storeId, setStoreId] = useState(null);

  useEffect(() => {
    const fetchStore = async () => {
      if (user?.userId && userRole === "shopowner") {
        try {
          const data = await getStoreByOwnerId(user.userId);
          setStoreId(data.storeId);
        } catch (err) {
          console.error("❌ Failed to fetch store ID for shopowner:", err);
        }
      }
    };
    fetchStore();
  }, [user, userRole]);

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
            content: <ShopApproval />,
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
      case "shopowner":
        return [
          { key: "profile", title: "👤 Profile", content: <ProfilePage /> },
          {
            key: "dashboard",
            title: "📊 Dashboard",
            content: <ShopOwnerDashboard />,
          },
          { key: "items", title: "📦 Items", content: <ItemManagement /> },
          {
            key: "orders",
            title: "🧾 Orders",
            content: <OrderManagement role="shopowner" storeId={storeId} />,
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
              : userRole === "shopowner"
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
