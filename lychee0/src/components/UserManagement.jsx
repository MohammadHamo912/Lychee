import React, { useState } from 'react';
import '../ComponentsCss/UserManagement.css';
import EditUserModal from './EditUserModal';

const UserManagement = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Sarah Connor',
      role: 'customer',
      email: 'sarah@example.com',
      active: true,
      phone: '123-456-7890',
      address: {
        city: 'Los Angeles',
        street: 'Sunset Blvd',
        building: '12B',
        zip: '90001',
      },
      registeredAt: '2024-01-10',
      lastLogin: '2025-04-10',
      orders: 12,
      totalSpent: 589.25,
      wishlist: 6,
      reviews: 4,
    },
    {
      id: 2,
      name: 'John Doe',
      role: 'store owner',
      email: 'john@example.com',
      active: true,
      phone: '555-555-5555',
      address: {
        city: 'New York',
        street: '5th Avenue',
        building: 'Suite 101',
        zip: '10001',
      },
      registeredAt: '2023-08-22',
      lastLogin: '2025-04-19',
      orders: 0,
      totalSpent: 0,
      wishlist: 0,
      reviews: 0,
    },
    {
      id: 3,
      name: 'Jane Smith',
      role: 'customer',
      email: 'jane@example.com',
      active: false,
      phone: '987-654-3210',
      address: {
        city: 'Chicago',
        street: 'Michigan Ave',
        building: '34A',
        zip: '60601',
      },
      registeredAt: '2024-06-01',
      lastLogin: '2024-12-15',
      orders: 3,
      totalSpent: 120.5,
      wishlist: 2,
      reviews: 1,
    },
  ]);

  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);

  const filteredUsers = users.filter((user) => {
    const matchesRole = filter === 'all' || user.role === filter;
    const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const handleEditUser = (user) => setEditingUser(user);

  const handleSaveUser = (id, updatedData) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updatedData } : u)));
    setEditingUser(null);
  };

  const toggleActive = (id) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, active: !u.active } : u))
    );
  };

  return (
    <div className="user-management-page">
      <div className="user-management-container">
        <div className="top-bar">
          <h2>👥 User Management</h2>
        </div>

        <div className="controls">
          <div className="filter-group">
            {['all', 'customer', 'store owner'].map((role) => (
              <button
                key={role}
                className={filter === role ? 'active' : ''}
                onClick={() => setFilter(role)}
              >
                {role === 'all' ? 'All Users' : `${role.charAt(0).toUpperCase() + role.slice(1)}s`}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="user-list">
          {filteredUsers.length === 0 ? (
            <p className="no-users">No users match your search or filter.</p>
          ) : (
            filteredUsers.map((user) => (
              <div key={user.id} className="user-card">
                <div className="user-info">
                  <h3>{user.name}</h3>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Role:</strong> {user.role}</p>
                  <p><strong>Status:</strong> {user.active ? 'Active' : 'Inactive'}</p>
                </div>
                <div className="user-actions">
                  <button onClick={() => toggleActive(user.id)}>
                    {user.active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button onClick={() => handleEditUser(user)}>Edit Info</button>
                  <button onClick={() => setViewingUser(user)}>View Details</button>
                </div>
              </div>
            ))
          )}
        </div>

        {editingUser && (
          <EditUserModal
            user={editingUser}
            onClose={() => setEditingUser(null)}
            onSave={handleSaveUser}
          />
        )}

        {viewingUser && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>User Details</h2>
              <p><strong>Name:</strong> {viewingUser.name}</p>
              <p><strong>Email:</strong> {viewingUser.email}</p>
              <p><strong>Phone:</strong> {viewingUser.phone}</p>
              <p><strong>Role:</strong> {viewingUser.role}</p>
              <p><strong>Status:</strong> {viewingUser.active ? 'Active' : 'Inactive'}</p>
              <p><strong>Registered:</strong> {viewingUser.registeredAt}</p>
              <p><strong>Last Login:</strong> {viewingUser.lastLogin}</p>
              <p><strong>Address:</strong> {viewingUser.address.street}, {viewingUser.address.building}, {viewingUser.address.city} - {viewingUser.address.zip}</p>
              <p><strong>Orders:</strong> {viewingUser.orders}</p>
              <p><strong>Total Spent:</strong> ${viewingUser.totalSpent.toFixed(2)}</p>
              <p><strong>Wishlist Items:</strong> {viewingUser.wishlist}</p>
              <p><strong>Reviews:</strong> {viewingUser.reviews}</p>
              <button className="close-button" onClick={() => setViewingUser(null)}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
