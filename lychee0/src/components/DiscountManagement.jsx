import React, { useState } from "react";
import "../ComponentsCss/DiscountManagement.css";

const DiscountManagement = () => {
  // State for form inputs
  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage", // 'percentage' or 'fixed'
    value: "",
    startDate: "",
    endDate: "",
  });

  // State for list of discounts (mock data for now)
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

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
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
    console.log("New discount added:", newDiscount);
    // Future: Send to backend API
  };

  // Toggle discount active status
  const toggleActive = (id) => {
    setDiscounts((prev) =>
      prev.map((discount) =>
        discount.id === id
          ? { ...discount, active: !discount.active }
          : discount
      )
    );
  };

  // Delete a discount
  const deleteDiscount = (id) => {
    setDiscounts((prev) => prev.filter((discount) => discount.id !== id));
  };

  return (
    <div className="discount-management">
      <h1 className="discount-title">Discount Management</h1>

      {/* Create Discount Form */}
      <section className="discount-form-section">
        <h2>Create New Discount</h2>
        <form onSubmit={handleSubmit} className="discount-form">
          <div className="form-group">
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
          <div className="form-group">
            <label htmlFor="discountType">Discount Type</label>
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
          <div className="form-group">
            <label htmlFor="value">Value</label>
            <input
              type="number"
              id="value"
              name="value"
              value={formData.value}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder="e.g., 20"
              required
            />
          </div>
          <div className="form-group">
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
          <div className="form-group">
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
          <button type="submit" className="submit-button">
            Add Discount
          </button>
        </form>
      </section>

      {/* Discount List */}
      <section className="discount-list-section">
        <h2>Existing Discounts</h2>
        {discounts.length === 0 ? (
          <p>No discounts available.</p>
        ) : (
          <table className="discount-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Type</th>
                <th>Value</th>
                <th>Start Date</th>
                <th>End Date</th>
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
                  <td>{discount.active ? "Active" : "Inactive"}</td>
                  <td>
                    <button
                      className="toggle-button"
                      onClick={() => toggleActive(discount.id)}
                    >
                      {discount.active ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => deleteDiscount(discount.id)}
                    >
                      Delete
                    </button>
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
