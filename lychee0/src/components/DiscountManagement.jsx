import React, { useState } from 'react';
import '../ComponentsCss/DiscountManagement.css';

const DiscountManagement = () => {
    const [discounts, setDiscounts] = useState([
        { id: 1, code: 'SAVE10', type: 'percentage', value: 10 },
        { id: 2, code: 'FIVEOFF', type: 'fixed', value: 5 },
    ]);

    const [form, setForm] = useState({ code: '', type: 'percentage', value: '' });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleAddDiscount = (e) => {
        e.preventDefault();
        const newDiscount = {
            id: Date.now(),
            code: form.code.toUpperCase(),
            type: form.type,
            value: parseFloat(form.value),
        };
        setDiscounts([...discounts, newDiscount]);
        setForm({ code: '', type: 'percentage', value: '' });
    };

    const handleDelete = (id) => {
        setDiscounts(discounts.filter(d => d.id !== id));
    };

    return (
        <div className="discount-management-container">
            <h2>Discount Management</h2>

            <form onSubmit={handleAddDiscount} className="discount-form">
                <input
                    type="text"
                    name="code"
                    placeholder="Discount Code"
                    value={form.code}
                    onChange={handleInputChange}
                    required
                />
                <select name="type" value={form.type} onChange={handleInputChange}>
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ($)</option>
                </select>
                <input
                    type="number"
                    name="value"
                    placeholder={form.type === 'percentage' ? 'e.g., 10%' : 'e.g., $5'}
                    value={form.value}
                    onChange={handleInputChange}
                    required
                />
                <button type="submit">Add Discount</button>
            </form>

            <div className="discount-list">
                {discounts.map(discount => (
                    <div key={discount.id} className="discount-card">
                        <h3>{discount.code}</h3>
                        <p>Type: {discount.type === 'percentage' ? 'Percentage' : 'Fixed'}</p>
                        <p>Value: {discount.type === 'percentage' ? `${discount.value}%` : `$${discount.value}`}</p>
                        <button onClick={() => handleDelete(discount.id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DiscountManagement;
