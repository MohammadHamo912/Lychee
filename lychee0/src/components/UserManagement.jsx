import React, { useState } from 'react';
import '../ComponentsCss/UserManagement.css';
import EditUserModal from './EditUserModal.jsx';

const UserManagement = () => {
    const [users, setUsers] = useState([
        { id: 1, name: 'Sarah Connor', role: 'customer', email: 'sarah@example.com', active: true },
        { id: 2, name: 'John Doe', role: 'store owner', email: 'john@example.com', active: true },
        { id: 3, name: 'Jane Smith', role: 'customer', email: 'jane@example.com', active: true },
    ]);

    const [filter, setFilter] = useState('all');
    const [editingUser, setEditingUser] = useState(null);

    const handleRoleChange = (userId, newRole) => {
        setUsers(users.map(user => user.id === userId ? { ...user, role: newRole } : user));
    };

    const handleToggleActive = (userId) => {
        setUsers(users.map(user => user.id === userId ? { ...user, active: !user.active } : user));
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
    };

    const handleSaveUser = (id, updatedData) => {
        setUsers(users.map(user => user.id === id ? { ...user, ...updatedData } : user));
        setEditingUser(null);
    };

    const filteredUsers =
        filter === 'all' ? users : users.filter(user => user.role === filter);

    return (
        <div className="user-management-container">
            <h2>User Management</h2>

            <div className="filter-controls">
                <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>All</button>
                <button onClick={() => setFilter('customer')} className={filter === 'customer' ? 'active' : ''}>Customers</button>
                <button onClick={() => setFilter('store owner')} className={filter === 'store owner' ? 'active' : ''}>Store Owners</button>
            </div>

            <div className="user-list">
                {filteredUsers.map(user => (
                    <div key={user.id} className="user-card">
                        <h3>{user.name}</h3>
                        <p>Email: {user.email}</p>
                        <p>Role: {user.role}</p>
                        <p>Status: {user.active ? 'Active' : 'Deactivated'}</p>

                        <div className="user-actions">
                            <button
                                onClick={() => handleRoleChange(user.id, user.role === 'customer' ? 'store owner' : 'customer')}
                            >
                                {user.role === 'customer' ? 'Promote to Store Owner' : 'Demote to Customer'}
                            </button>
                            <button onClick={() => handleToggleActive(user.id)}>
                                {user.active ? 'Deactivate' : 'Activate'}
                            </button>
                            <button onClick={() => handleEditUser(user)}>
                                Edit Info
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {editingUser && (
                <EditUserModal
                    user={editingUser}
                    onClose={() => setEditingUser(null)}
                    onSave={handleSaveUser}
                />
            )}
        </div>
    );
};

export default UserManagement;
