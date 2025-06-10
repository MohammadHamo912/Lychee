import React, { useState, useEffect } from "react";
import "../ComponentsCss/UserManagement.css";
import EditUserModal from "./EditUserModal";
import { getAllUsers, createUser, updateUser, deleteUser } from "../api/users";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);
  const [newUser, setNewUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const normalizeUser = (user) => ({
    id: user.user_id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    registeredAt: user.created_at,
    lastLogin: user.updated_at,
    orders: 0,
    totalSpent: 0,
    wishlist: 0,
    reviews: 0,
  });

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllUsers();

      const mappedUsers = data
        .filter((user) => user.deleted_at === null)
        .map(normalizeUser);

      setUsers(mappedUsers);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setError("Failed to load users. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesRole = filter === "all" || user.role === filter;
    const matchesSearch =
      user.name && user.name.toLowerCase().includes(search.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const handleEditUser = (user) => setEditingUser({ ...user });

  const handleSaveUser = async (id, userData) => {
    setIsLoading(true);
    setError(null);
    try {
      const userForApi = {
        user_id: id,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: userData.role,
      };

      const updatedUser = await updateUser(id, userForApi);

      setUsers((prev) =>
        prev.map((u) =>
          u.id === id
            ? {
              ...u,
              name: updatedUser.name,
              email: updatedUser.email,
              phone: updatedUser.phone,
              role: updatedUser.role,
            }
            : u
        )
      );

      setEditingUser(null);
    } catch (error) {
      console.error("Failed to update user:", error);
      setError("Failed to update user. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = async (userData) => {
    setIsLoading(true);
    setError(null);
    try {
      const userForApi = {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: userData.role,
        password: "defaultPassword123",
      };

      const createdUser = await createUser(userForApi);

      const newUserForState = normalizeUser(createdUser);

      setUsers((prev) => [...prev, newUserForState]);
      setNewUser(null);
    } catch (error) {
      console.error("Failed to create user:", error);
      setError("Failed to create user. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id);
        setUsers((prev) => prev.filter((u) => u.id !== id));
      } catch (error) {
        console.error("Failed to delete user:", error);
        setError("Failed to delete user. Please try again.");
      }
    }
  };

  return (
    <div className="user-management-page">
      <div className="user-management-container">
        <div className="top-bar-user-managamement">
          <h2>👥 User Management</h2>
        </div>

        <div className="controls">
          <div className="filter-group">
            {["all", "customer", "shopowner"].map((role) => (
              <button
                key={role}
                className={filter === role ? "active" : ""}
                onClick={() => setFilter(role)}
              >
                {role === "all"
                  ? "All Users"
                  : `${role.charAt(0).toUpperCase() + role.slice(1)}s`}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="add-user-button" onClick={() => setNewUser({})}>
            ➕ Add User
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {isLoading ? (
          <div className="loading">Loading users...</div>
        ) : (
          <div className="user-list">
            {filteredUsers.length === 0 ? (
              <p className="no-users">No users match your search or filter.</p>
            ) : (
              filteredUsers.map((user) => (
                <div key={user.id} className="user-card">
                  <div className="user-info">
                    <h3>{user.name}</h3>
                    <p>
                      <strong>Email:</strong> {user.email}
                    </p>
                    <p>
                      <strong>Role:</strong> {user.role}
                    </p>
                  </div>
                  <div className="user-actions">
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Delete
                    </button>
                    <button onClick={() => handleEditUser(user)}>
                      Edit Info
                    </button>
                    <button onClick={() => setViewingUser({ ...user })}>
                      View Details
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {editingUser && (
          <EditUserModal
            user={editingUser}
            onClose={() => setEditingUser(null)}
            onSave={handleSaveUser}
          />
        )}

        {newUser && (
          <EditUserModal
            user={newUser}
            onClose={() => setNewUser(null)}
            onSave={(_, userData) => handleAddUser(userData)}
          />
        )}

        {viewingUser && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>User Details</h2>
              <p>
                <strong>Name:</strong> {viewingUser.name}
              </p>
              <p>
                <strong>Email:</strong> {viewingUser.email}
              </p>
              <p>
                <strong>Phone:</strong> {viewingUser.phone}
              </p>
              <p>
                <strong>Role:</strong> {viewingUser.role}
              </p>
              <p>
                <strong>Registered:</strong> {viewingUser.registeredAt}
              </p>
              <p>
                <strong>Last Login:</strong> {viewingUser.lastLogin}
              </p>
              <p>
                <strong>Orders:</strong> {viewingUser.orders}
              </p>
              <p>
                <strong>Total Spent:</strong> $
                {viewingUser.totalSpent?.toFixed(2) || "0.00"}
              </p>
              <p>
                <strong>Wishlist Items:</strong> {viewingUser.wishlist}
              </p>
              <p>
                <strong>Reviews:</strong> {viewingUser.reviews}
              </p>
              <button
                className="close-button"
                onClick={() => setViewingUser(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
