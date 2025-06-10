import React, { useState, useEffect } from "react";
import "../ComponentsCss/ProfilePage.css";
import { getTotalSpendingByUserId, updateUser } from "../api/users";

const ProfilePage = () => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [userData, setUserData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [totalSpending, setTotalSpending] = useState(null);

  useEffect(() => {
    if (!user) return;

    const profile = {
      firstName: user?.name?.split(" ")[0] || "",
      lastName: user?.name?.split(" ")[1] || "",
      email: user?.email || "",
      phone: user?.phone || "",
      dob: user?.dob || "",
      password: "",
    };

    setUserData(profile);

    const fetchSpending = async () => {
      try {
        const total = await getTotalSpendingByUserId(user.userId);
        setTotalSpending(total);
      } catch (err) {
        console.error("Failed to fetch total spending", err);
        setTotalSpending(0.0);
      }
    };

    fetchSpending();
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

      const res = await updateUser(user.userId, updatedUser);
      alert("Profile updated!");
      localStorage.setItem("user", JSON.stringify(res));
      window.location.reload();
    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update profile.");
    }

    setEditing(false);
  };

  if (!user) return <p>Please log in to view your profile.</p>;
  if (!userData) return <p>Loading profile...</p>;

  return (
    <div className="profile-page-layout">
      <div className="profile-box">
        <h1>My Profile</h1>

        <div className="profile-field-row">
          <div className="profile-half profile-field">
            <label>First Name</label>
            <input
              name="firstName"
              value={userData.firstName}
              onChange={handleChange}
              disabled={!editing}
            />
          </div>
          <div className="profile-half profile-field">
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

      <div className="profile-extra-box">
        <div className="spending-box">
          <h2>Total Spending</h2>
          <p>{totalSpending !== null ? `$${totalSpending.toFixed(2)}` : "Loading..."}</p>
        </div>

        <div className="spending-box">
          <h2>Total Points</h2>
          <p>Coming Soon</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
