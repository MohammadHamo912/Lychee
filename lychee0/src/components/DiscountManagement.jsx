import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./NavBar";
import {
  getAllDiscounts,
  createDiscount,
  toggleDiscount,
  deleteDiscount,
} from "../api/discounts";
import "../ComponentsCss/DiscountManagement.css";

const DiscountManagement = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    code: "",
    value: "",
    startDate: "",
    endDate: "",
  });

  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDiscounts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllDiscounts();
      console.log("Fetched discounts:", data); // Debug log
      setDiscounts(data || []);
    } catch (error) {
      console.error("Failed to fetch discounts:", error.message);
      setError("Failed to load discounts: " + error.message);
      setDiscounts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);

      // ✅ Fix: Use correct field name for backend
      const newDiscount = {
        code: formData.code,
        discountPercentage: parseFloat(formData.value), // ✅ Changed from 'value' to 'discountPercentage'
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
        active: true, // ✅ Explicitly set active status
      };

      console.log("Creating discount:", newDiscount); // Debug log

      await createDiscount(newDiscount);
      await fetchDiscounts(); // Refresh the list

      // Reset form
      setFormData({
        code: "",
        value: "",
        startDate: "",
        endDate: "",
      });

      console.log("Discount created successfully");
    } catch (error) {
      console.error("Failed to create discount:", error.message);
      setError("Failed to create discount: " + error.message);
    }
  };

  const handleToggle = async (id) => {
    try {
      setError(null);
      console.log("Toggling discount:", id); // Debug log
      await toggleDiscount(id);
      await fetchDiscounts(); // Refresh the list
    } catch (error) {
      console.error("Failed to toggle discount:", error.message);
      setError("Failed to toggle discount: " + error.message);
    }
  };

  const handleDelete = async (id, code) => {
    try {
      setError(null);

      // Add confirmation
      if (
        !window.confirm(`Are you sure you want to delete discount "${code}"?`)
      ) {
        return;
      }

      console.log("Deleting discount:", id); // Debug log
      await deleteDiscount(id);
      await fetchDiscounts(); // Refresh the list
      console.log("Discount deleted successfully");
    } catch (error) {
      console.error("Failed to delete discount:", error.message);
      setError("Failed to delete discount: " + error.message);
    }
  };

  return (
    <div className="discount-management">
      <div className="discount-header">
        <h1 className="discount-title">Discount Management</h1>
      </div>

      {/* Error Display */}
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      <section className="discount-form-section">
        <h2 className="section-heading">Create New Discount</h2>
        <form onSubmit={handleSubmit} className="discount-form">
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
              <label htmlFor="value">Percentage</label>
              <input
                type="number"
                id="value"
                name="value"
                value={formData.value}
                onChange={handleChange}
                placeholder="e.g., 20"
                min="1"
                max="100"
                step="0.01"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="startDate">Start Date</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
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
              />
            </div>

            <div className="form-field">
              <label>&nbsp;</label>
              <button
                type="submit"
                className="submit-button"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Discount"}
              </button>
            </div>
          </div>
        </form>
      </section>

      <section className="discount-list-section">
        <h2 className="section-heading">Existing Discounts</h2>

        {loading && <p className="loading-state">Loading discounts...</p>}

        {!loading && discounts.length === 0 ? (
          <p className="empty-state">No discounts available.</p>
        ) : (
          <table className="discount-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Percentage</th>
                <th>Start</th>
                <th>End</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {discounts.map((discount, index) => (
                <tr
                  key={
                    discount.discountId || discount.id || `discount-${index}`
                  }
                >
                  <td>{discount.code}</td>
                  <td>{`${discount.discountPercentage || discount.value}%`}</td>
                  <td>{discount.startDate || "No start date"}</td>
                  <td>{discount.endDate || "No end date"}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        discount.active ? "active" : "inactive"
                      }`}
                    >
                      {discount.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="action-button activate-btn"
                        onClick={() =>
                          handleToggle(discount.discountId || discount.id)
                        }
                        disabled={loading}
                      >
                        {discount.active ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        className="action-button delete-btn"
                        onClick={() =>
                          handleDelete(
                            discount.discountId || discount.id,
                            discount.code
                          )
                        }
                        disabled={loading}
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
