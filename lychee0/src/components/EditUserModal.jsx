import React, { useState, useEffect } from "react";
import "../ComponentsCss/EditUserModal.css";

const EditUserModal = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "customer", // Default to customer role
    active: true,
    orders: 0,
    totalSpent: 0,
    wishlist: 0,
    reviews: 0,
  });
  const [formErrors, setFormErrors] = useState({});

  // Fill form with user data if editing
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        role: user.role || "customer",
        active: user.hasOwnProperty("active") ? user.active : true,
        orders: user.orders || 0,
        totalSpent: user.totalSpent || 0,
        wishlist: user.wishlist || 0,
        reviews: user.reviews || 0,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }

    // Add more validation as needed

    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Clear errors if validation passes
    setFormErrors({});

    // Convert numeric fields from strings to numbers
    const processedData = {
      ...formData,
      orders: Number(formData.orders || 0),
      totalSpent: Number(formData.totalSpent || 0),
      wishlist: Number(formData.wishlist || 0),
      reviews: Number(formData.reviews || 0),
    };

    onSave(user.id, processedData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{user.id ? "Edit User Info" : "Add New User"}</h3>
        <form onSubmit={handleSubmit} className="edit-user-form">
          <div className="form-field">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className={formErrors.name ? "error" : ""}
            />
            {formErrors.name && (
              <span className="error-text">{formErrors.name}</span>
            )}
          </div>

          <div className="form-field">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className={formErrors.email ? "error" : ""}
            />
            {formErrors.email && (
              <span className="error-text">{formErrors.email}</span>
            )}
          </div>

          <div className="form-field">
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="customer">Customer</option>
              <option value="shopowner">Shop Owner</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="modal-actions">
            <button type="submit">Save</button>
            <button type="button" className="cancel" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
