import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../ComponentsCss/UserManagement.css';
import EditUserModal from '../../components/EditUserModal';

const UserManagement = () => {
    const navigate = useNavigate();

    const [users, setUsers] = useState([
        { id: 1, name: 'Sarah Connor', role: 'customer', email: 'sarah@example.com', active: true },
        { id: 2, name: 'John Doe', role: 'store owner', email: 'john@example.com', active: true },
        { id: 3, name: 'Jane Smith', role: 'customer', email: 'jane@example.com', active: true },
    ]);

    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [editingUser, setEditingUser] = useState(null);

    const handleRoleChange = (userId) => {
        setUsers(users.map(user =>
            user.id === userId
                ? { ...user, role: user.role === 'customer' ? 'store owner' : 'customer' }
                : user
        ));
    };

    const handleToggleActive = (userId) => {
        setUsers(users.map(user =>
            user.id === userId
                ? { ...user, active: !user.active }
                : user
        ));
    };

    const handleEditUser = (user) => setEditingUser(user);

    const handleSaveUser = (id, updatedData) => {
        setUsers(users.map(user =>
            user.id === id ? { ...user, ...updatedData } : user
        ));
        setEditingUser(null);
    };

    const filteredUsers = users.filter(user => {
        const matchesRole = filter === 'all' || user.role === filter;
        const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase());
        return matchesRole && matchesSearch;
    });

    return (
        <div className="user-management-container">
            <div className="top-bar">
                <button className="back-button" onClick={() => navigate('/admin')}>
                    ← Back to Dashboard
                </button>
                <h2>👥 User Management</h2>
            </div>

            <div className="filter-search-bar">
                <div className="filters">
                    {['all', 'customer', 'store owner'].map((role) => (
                        <button
                            key={role}
                            onClick={() => setFilter(role)}
                            className={filter === role ? 'active' : ''}
                        >
                            {role === 'all' ? 'All Users' : role.charAt(0).toUpperCase() + role.slice(1) + 's'}
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
                    filteredUsers.map(user => (
                        <div key={user.id} className="user-card">
                            <div className="user-info">
                                <h3>{user.name}</h3>
                                <p><strong>Email:</strong> {user.email}</p>
                                <p><strong>Role:</strong> {user.role}</p>
                                <p><strong>Status:</strong> {user.active ? 'Active' : 'Deactivated'}</p>
                            </div>
                            <div className="user-actions">
                                <button onClick={() => handleRoleChange(user.id)}>
                                    {user.role === 'customer' ? 'Promote to Store Owner' : 'Demote to Customer'}
                                </button>
                                <button onClick={() => handleToggleActive(user.id)}>
                                    {user.active ? 'Deactivate' : 'Activate'}
                                </button>
                                <button onClick={() => handleEditUser(user)}>Edit Info</button>
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
        </div>
    );
};

export default UserManagement;
