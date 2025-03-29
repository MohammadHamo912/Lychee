import React from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import "../PagesCss/AdminDashboard.css";

const AdminDashboard = () => {
    const navigate = useNavigate();

    const sections = [
        {
            title: "👥 User Management",
            description: "Manage registered users, edit roles or remove accounts.",
            link: "/admin/usermanagement",
        },
        {
            title: "🛍️ Shop Approval",
            description: "Approve or deny new shop applications.",
            link: "/admin/shopapproval",
        },
        {
            title: "🎁 Discount Management",
            description: "Create and manage platform-wide promotions.",
            link: "/admin/discountmanagment",
        },
    ];

    return (
        <div className="admin-dashboard">
            <NavBar isAdmin={true} />

            <main className="admin-main">
                <h1 className="admin-title">Admin Dashboard 🛠️</h1>

                <div className="admin-cards-grid">
                    {sections.map((section, index) => (
                        <div
                            key={index}
                            className="admin-dashboard-card"
                            onClick={() => navigate(section.link)}
                        >
                            <h3>{section.title}</h3>
                            <p>{section.description}</p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
