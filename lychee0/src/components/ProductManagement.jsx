import React, { useState, useEffect } from 'react';
import FiltersPanel from '../components/FiltersPanel';
import '../ComponentsCss/ProductManagement.css';

const categories = ['Makeup', 'Skincare', 'Fragrance', 'Hair', 'Other'];

const ProductManagement = () => {
    const [products, setProducts] = useState([
        {
            id: 1,
            name: 'Lip Gloss',
            price: 9.99,
            description: 'A high-quality lip gloss that adds shine and hydration.',
            imageUrl: '/images/lipgloss.jpeg',
            category: 'Makeup',
        },
    ]);

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        category: '',
        imageFile: null,
        imageUrl: '',
    });

    const [editingProduct, setEditingProduct] = useState(null);
    const [filters, setFilters] = useState({ category: 'All', minPrice: '', maxPrice: '', sortOption: '' });
    const [filteredResults, setFilteredResults] = useState([]);

    useEffect(() => {
        applyFilters(filters);
    }, [products, filters]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({
                ...prev,
                imageFile: file,
                imageUrl: URL.createObjectURL(file),
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { name, price, description, imageFile, imageUrl, category } = formData;

        if (!name || !price || !description || !category || (!imageFile && !editingProduct)) {
            alert('Please fill out all fields and upload an image.');
            return;
        }

        const newProduct = { ...formData, price: parseFloat(price) };

        if (editingProduct) {
            setProducts((prev) =>
                prev.map((prod) =>
                    prod.id === editingProduct.id ? { ...editingProduct, ...newProduct } : prod
                )
            );
            setEditingProduct(null);
        } else {
            setProducts((prev) => [...prev, { ...newProduct, id: Date.now() }]);
        }

        setFormData({
            name: '',
            price: '',
            description: '',
            category: '',
            imageFile: null,
            imageUrl: '',
        });
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            price: product.price,
            description: product.description,
            category: product.category,
            imageFile: null,
            imageUrl: product.imageUrl,
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteProduct = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            setProducts(products.filter((prod) => prod.id !== id));
        }
    };

    const handleCancelEdit = () => {
        setEditingProduct(null);
        setFormData({
            name: '',
            price: '',
            description: '',
            category: '',
            imageFile: null,
            imageUrl: '',
        });
    };

    const applyFilters = (filters) => {
        let updated = [...products];

        if (filters.category && filters.category !== 'All') {
            updated = updated.filter((item) => item.category === filters.category);
        }

        if (filters.minPrice) {
            updated = updated.filter((item) => item.price >= parseFloat(filters.minPrice));
        }

        if (filters.maxPrice) {
            updated = updated.filter((item) => item.price <= parseFloat(filters.maxPrice));
        }

        switch (filters.sortOption) {
            case 'priceLowToHigh':
                updated.sort((a, b) => a.price - b.price);
                break;
            case 'priceHighToLow':
                updated.sort((a, b) => b.price - a.price);
                break;
            case 'nameAZ':
                updated.sort((a, b) => a.name.localeCompare(b.name));
                break;
            default:
                break;
        }

        setFilteredResults(updated);
    };

    return (
        <div className="product-management-container">
            <h2>Product Management</h2>

            <div className="product-form-card">
                <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                <form className="product-form" onSubmit={handleSubmit}>
                    <div className="form-inline-group">
                        <input type="text" name="name" placeholder="Product Name" value={formData.name} onChange={handleInputChange} required />
                        <input type="number" name="price" step="0.01" placeholder="Price" value={formData.price} onChange={handleInputChange} required />
                    </div>

                    <select name="category" value={formData.category} onChange={handleInputChange} className="category-select" required>
                        <option value="">Choose a category</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>

                    <textarea name="description" placeholder="Product Description" rows={4} value={formData.description} onChange={handleInputChange} required />

                    <label className="image-upload-label">
                        Upload Image
                        <input type="file" accept="image/*" onChange={handleImageChange} />
                    </label>

                    {formData.imageUrl && (
                        <div className="preview-wrapper">
                            <img src={formData.imageUrl} alt="Preview" className="image-preview" />
                        </div>
                    )}

                    <div className="form-buttons">
                        <button type="submit">{editingProduct ? 'Update Product' : 'Add Product'}</button>
                        {editingProduct && (
                            <button type="button" className="cancel-btn" onClick={handleCancelEdit}>Cancel</button>
                        )}
                    </div>
                </form>
            </div>

            <div className="filters-wrapper horizontal-layout">
                <FiltersPanel onApplyFilters={applyFilters} categories={categories} />
            </div>


            <div className="product-list">
                {filteredResults.length === 0 ? (
                    <p className="no-products">No products found.</p>
                ) : (
                    filteredResults.map((product) => (
                        <div key={product.id} className={`product-card ${editingProduct?.id === product.id ? 'editing' : ''}`}>
                            <img src={product.imageUrl} alt={product.name} className="product-image" />
                            <div className="product-details">
                                <h3>{product.name}</h3>
                                <p className="product-category">{product.category}</p>
                                <p className="product-price">${product.price.toFixed(2)}</p>
                                <p className="product-desc">{product.description}</p>
                            </div>
                            <div className="product-actions">
                                <button onClick={() => handleEditProduct(product)}>Edit</button>
                                <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ProductManagement;
