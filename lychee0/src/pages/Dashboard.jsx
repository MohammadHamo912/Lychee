import React, { useState, useEffect } from "react";
import "../PagesCss/Dashboard.css";
import { useUser } from "../context/UserContext";
import { getStoreByOwnerId } from "../api/stores";

// Components by role
import NavBar from "../components/NavBar";
import ProfilePage from "../components/ProfilePage";
import ShowMyReviews from "../components/ShowMyReviews";
import Wishlist from "../components/WishList";
import ShopOwnerDashboard from "../components/ShopOwnerDashboard";
import ProductManagement from "../components/ProductManagement";
import OrderManagement from "../components/OrderManagement";
import StoreReviewAndSocial from "../components/StoreReviewAndSocial";
import UserManagement from "../components/UserManagement";
import ShopApproval from "../components/ShopManagement";
import DiscountManagement from "../components/DiscountManagement";
import AdminOverview from "../components/AdminOverview";

const Dashboard = () => {
  const { user } = useUser();
  const userRole = user?.role || "customer";
  const [activeTab, setActiveTab] = useState("default");

  const [storeId, setStoreId] = useState(null);

  useEffect(() => {
    const fetchStore = async () => {
      if (user?.userId && user?.role === "shopowner") {
        try {
          const data = await getStoreByOwnerId(user.userId);
          setStoreId(data.storeId);
        } catch (err) {
          console.error("Failed to fetch store for reviews tab:", err);
        }
      }
    };
    fetchStore();
  }, [user]);


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
          {
            key: "products",
            title: "📦 Products",
            content: <ProductManagement />,
          },
          {
            key: "orders",
            title: "🧾 Orders",
            content: <OrderManagement role="shopowner" />,
          },
          {
            key: "reviewsAndSocial",
            title: "🌐 Social",
            content: <StoreReviewAndSocial storeId={storeId}/>,
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
