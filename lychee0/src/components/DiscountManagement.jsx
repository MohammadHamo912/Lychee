import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./NavBar";
import "../ComponentsCss/DiscountManagement.css";

const DiscountManagement = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage",
    value: "",
    startDate: "",
    endDate: "",
  });

  const [discounts, setDiscounts] = useState([
    {
      id: 1,
      code: "SPRING20",
      type: "percentage",
      value: 20,
      startDate: "2025-03-01",
      endDate: "2025-04-01",
      active: true,
    },
    {
      id: 2,
      code: "FLAT10",
      type: "fixed",
      value: 10,
      startDate: "2025-03-15",
      endDate: "2025-03-31",
      active: false,
    },
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newDiscount = {
      id: discounts.length + 1,
      code: formData.code,
      type: formData.discountType,
      value: parseFloat(formData.value),
      startDate: formData.startDate,
      endDate: formData.endDate,
      active: true,
    };
    setDiscounts((prev) => [...prev, newDiscount]);
    setFormData({
      code: "",
      discountType: "percentage",
      value: "",
      startDate: "",
      endDate: "",
    });
  };

  const toggleActive = (id) => {
    setDiscounts((prev) =>
      prev.map((d) => (d.id === id ? { ...d, active: !d.active } : d))
    );
  };

  const deleteDiscount = (id) => {
    setDiscounts((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <div className="discount-management">
      <div className="discount-header">
        <h1 className="discount-title">Discount Management</h1>
      </div>

      <section className="discount-form-section">
        <h2 className="section-heading">Create New Discount</h2>
        <form onSubmit={handleSubmit} className="discount-form">
          {/* First row */}
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="code">Discount Code</label>
              <input
                type="text"
                id="code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="e.g., SPRING20"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="discountType">Type</label>
              <select
                id="discountType"
                name="discountType"
                value={formData.discountType}
                onChange={handleChange}
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="value">Value</label>
              <input
                type="number"
                id="value"
                name="value"
                value={formData.value}
                onChange={handleChange}
                placeholder="e.g., 20"
                min="1"
                required
              />
            </div>
          </div>

          {/* Second row */}
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="startDate">Start Date</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="endDate">End Date</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field">
              <label>&nbsp;</label>
              <button type="submit" className="submit-button">
                Add Discount
              </button>
            </div>
          </div>
        </form>
      </section>

      <section className="discount-list-section">
        <h2 className="section-heading">Existing Discounts</h2>
        {discounts.length === 0 ? (
          <p className="empty-state">No discounts available.</p>
        ) : (
          <table className="discount-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Type</th>
                <th>Value</th>
                <th>Start</th>
                <th>End</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {discounts.map((discount) => (
                <tr key={discount.id}>
                  <td>{discount.code}</td>
                  <td>{discount.type}</td>
                  <td>
                    {discount.type === "percentage"
                      ? `${discount.value}%`
                      : `$${discount.value}`}
                  </td>
                  <td>{discount.startDate}</td>
                  <td>{discount.endDate}</td>
                  <td>
                    <span
                      className={`status-badge ${discount.active ? "active" : "inactive"
                        }`}
                    >
                      {discount.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="action-button activate-btn"
                        onClick={() => toggleActive(discount.id)}
                      >
                        {discount.active ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        className="action-button delete-btn"
                        onClick={() => deleteDiscount(discount.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

export default DiscountManagement;