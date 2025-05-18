import React, { useState, useEffect } from "react";
import "../ComponentsCss/ProfilePage.css";
import { useUser } from "../context/UserContext";
import axios from "axios";

const ProfilePage = () => {
  const { user, logout } = useUser();
  const [userData, setUserData] = useState(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    // Load user data on mount
    setUserData({
      firstName: user?.name?.split(" ")[0] || "",
      lastName: user?.name?.split(" ")[1] || "",
      email: user?.email || "",
      phone: user?.phone || "",
      dob: user?.dob || "",
      password: "",
    });
  }, [user]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const updatedUser = {
        ...user,
        name: `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
        phone: userData.phone,
        passwordHash: userData.password || user.passwordHash,
      };

      const res = await axios.put(
        `http://localhost:8081/api/users/${user.userId}`,
        updatedUser
      );

      alert("Profile updated!");
      localStorage.setItem("user", JSON.stringify(res.data));
      window.location.reload(); // or update context if preferred
    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update profile.");
    }

    setEditing(false);
  };

  if (!userData) return <p>Loading...</p>;

  const dummyOrders = [
    { id: 1, date: "2024-03-01", total: 49.99 },
    { id: 2, date: "2024-02-15", total: 79.5 },
    { id: 3, date: "2024-01-20", total: 22.0 },
  ];

  const totalSpending = dummyOrders.reduce((sum, order) => sum + order.total, 0);
  const totalPoints = Math.floor(totalSpending);

  return (
    <div className="profile-page-layout">
      {/* LEFT - Editable Profile Info */}
      <div className="profile-box">
        <h1>My Profile</h1>

        <div className="profile-field-row">
          <div className="profile-half">
            <label>First Name</label>
            <input
              name="firstName"
              value={userData.firstName}
              onChange={handleChange}
              disabled={!editing}
            />
          </div>
          <div className="profile-half">
            <label>Last Name</label>
            <input
              name="lastName"
              value={userData.lastName}
              onChange={handleChange}
              disabled={!editing}
            />
          </div>
        </div>

        <div className="profile-field">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            disabled={!editing}
          />
        </div>

        <div className="profile-field">
          <label>Phone</label>
          <input
            name="phone"
            value={userData.phone}
            onChange={handleChange}
            disabled={!editing}
          />
        </div>

        <div className="profile-field">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
            disabled={!editing}
            placeholder={editing ? "Enter new password" : "********"}
          />
        </div>

        <div className="profile-field">
          <label>Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={userData.dob}
            onChange={handleChange}
            disabled={!editing}
          />
        </div>

        <button className="profile-btn" onClick={editing ? handleSave : () => setEditing(true)}>
          {editing ? "Save Changes" : "Edit Profile"}
        </button>
      </div>

      {/* RIGHT - Spending Summary */}
      <div className="profile-extra-box">
        <div className="spending-box">
          <h2>Total Spending</h2>
          <p>${totalSpending.toFixed(2)}</p>
        </div>

        <div className="spending-box">
          <h2>Total Points</h2>
          <p>{totalPoints} pts</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
