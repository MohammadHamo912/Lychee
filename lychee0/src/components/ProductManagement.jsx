import React, { useState, useEffect } from 'react';
import FiltersPanel from '../components/FiltersPanel';
import '../ComponentsCss/ProductManagement.css';

const categories = ['Makeup', 'Skincare', 'Fragrance', 'Hair', 'Other'];

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [filters, setFilters] = useState({ category: 'All', minPrice: '', maxPrice: '', sortOption: '' });
    const [filteredResults, setFilteredResults] = useState([]);

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        discount: '',
        category: '',
        imageFile: null,
        imageUrl: '',
        features: [],
        newFeature: '',
        shades: [],
        newShade: '',
        shop_name: 'Awesome Store',
        rating: 0,
        reviews: 0,
        barcode: '',
        brandName: ''
    });

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

    const addFeature = () => {
        const feature = formData.newFeature.trim();
        if (feature && !formData.features.includes(feature)) {
            setFormData((prev) => ({
                ...prev,
                features: [...prev.features, feature],
                newFeature: '',
            }));
        }
    };

    const removeFeature = (f) => {
        setFormData((prev) => ({
            ...prev,
            features: prev.features.filter((item) => item !== f),
        }));
    };

    const addShade = () => {
        const shade = formData.newShade.trim();
        if (shade && !formData.shades.includes(shade)) {
            setFormData((prev) => ({
                ...prev,
                shades: [...prev.shades, shade],
                newShade: '',
            }));
        }
    };

    const removeShade = (s) => {
        setFormData((prev) => ({
            ...prev,
            shades: prev.shades.filter((item) => item !== s),
        }));
    };

    const resetForm = () => {
        setFormData({
            name: '',
            price: '',
            discount: '',
            category: '',
            imageFile: null,
            imageUrl: '',
            features: [],
            newFeature: '',
            shades: [],
            newShade: '',
            shop_name: 'Awesome Store',
            rating: 0,
            reviews: 0,
            barcode: '',
            brandName: '',
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { name, price, description, imageUrl, category } = formData;

        if (!name || !price || !description || !category || !imageUrl) {
            alert('Please fill all required fields.');
            return;
        }

        const newProduct = {
            ...formData,
            id: editingProduct ? editingProduct.id : Date.now(),
            price: parseFloat(formData.price),
            originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
            discount: formData.originalPrice
                ? `${Math.round((1 - formData.price / formData.originalPrice) * 100)}%`
                : null,
        };

        if (editingProduct) {
            setProducts((prev) =>
                prev.map((p) => (p.id === editingProduct.id ? newProduct : p))
            );
            setEditingProduct(null);
        } else {
            setProducts((prev) => [...prev, newProduct]);
        }

        resetForm();
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setFormData({ ...product, newFeature: '', newShade: '' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteProduct = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            setProducts((prev) => prev.filter((p) => p.id !== id));
        }
    };

    const handleCancelEdit = () => {
        setEditingProduct(null);
        resetForm();
    };

    const applyFilters = (filters) => {
        let updated = [...products];

        if (filters.category !== 'All') {
            updated = updated.filter((p) => p.category === filters.category);
        }
        if (filters.minPrice) {
            updated = updated.filter((p) => p.price >= parseFloat(filters.minPrice));
        }
        if (filters.maxPrice) {
            updated = updated.filter((p) => p.price <= parseFloat(filters.maxPrice));
        }
        if (filters.sortOption === 'priceLowToHigh') {
            updated.sort((a, b) => a.price - b.price);
        }
        if (filters.sortOption === 'priceHighToLow') {
            updated.sort((a, b) => b.price - a.price);
        }
        if (filters.sortOption === 'nameAZ') {
            updated.sort((a, b) => a.name.localeCompare(b.name));
        }

        setFilteredResults(updated);
    };

    return (
        <div className="pm-container">
            <h2>Product Management</h2>

            {/* Product Form */}
            <div className="pm-form-card">
                <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                <form className="pm-form" onSubmit={handleSubmit}>
                    <div className="pm-form-group">
                        <input name="name" placeholder="Product Name" value={formData.name} onChange={handleInputChange} required />
                        <input name="price" placeholder="Price" type="number" value={formData.price} onChange={handleInputChange} required />
                        <input name="discount" placeholder="Discount" type="number" value={formData.discount} onChange={handleInputChange} />
                    </div>

                    <select name="category" value={formData.category} onChange={handleInputChange} required>
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    {/* Features */}
                    <div className="pm-list-group">
                        <label>Features</label>
                        <div className="pm-inline-add">
                            <input type="text" placeholder="Add feature..." value={formData.newFeature} onChange={(e) => setFormData({ ...formData, newFeature: e.target.value })} />
                            <button type="button" onClick={addFeature}>Add</button>
                        </div>
                        <ul className="pm-pill-list">
                            {formData.features.map((f, i) => (
                                <li key={i} className="pm-pill">{f}<span onClick={() => removeFeature(f)}>&times;</span></li>
                            ))}
                        </ul>
                    </div>

                    {/* Shades */}
                    <div className="pm-list-group">
                        <label>Shades</label>
                        <div className="pm-inline-add">
                            <input type="text" placeholder="Add shade..." value={formData.newShade} onChange={(e) => setFormData({ ...formData, newShade: e.target.value })} />
                            <button type="button" onClick={addShade}>Add</button>
                        </div>
                        <ul className="pm-pill-list">
                            {formData.shades.map((s, i) => (
                                <li key={i} className="pm-pill">{s}<span onClick={() => removeShade(s)}>&times;</span></li>
                            ))}
                        </ul>
                    </div>

                    {/* Barcode & Brand */}
                    <div className="pm-form-group">
                        <input type="text" name="barcode" placeholder="Barcode" value={formData.barcode} onChange={handleInputChange} />
                        <input type="text" name="brandName" placeholder="Brand Name" value={formData.brandName} onChange={handleInputChange} />
                    </div>

                    {/* Image Upload + Buttons */}
                    <div className="pm-inline-buttons">
                        <label className="pm-image-upload">
                            Upload Image
                            <input type="file" accept="image/*" onChange={handleImageChange} />
                        </label>

                        {formData.imageUrl && (
                            <img src={formData.imageUrl} alt="Preview" className="pm-image-preview" />
                        )}

                        <div className="pm-button-group">
                            <button type="submit">{editingProduct ? 'Update' : 'Add'} Product</button>
                            {editingProduct && <button type="button" className="pm-cancel-btn" onClick={handleCancelEdit}>Cancel</button>}
                        </div>
                    </div>
                </form>
            </div>

            {/* Filter + Product List */}
            <div className="pm-layout">
                <div className="pm-sidebar">
                    <FiltersPanel onApplyFilters={applyFilters} categories={categories} />
                </div>

                <div className="pm-grid">
                    {filteredResults.length === 0 ? (
                        <p className="pm-empty">No products found.</p>
                    ) : (
                        filteredResults.map((product) => (
                            <div key={product.id} className="pm-card">
                                <img src={product.imageUrl} alt={product.name} className="pm-card-img" />
                                <div className="pm-card-body">
                                    <h4>{product.name}</h4>
                                    <p className="pm-cat">{product.category}</p>
                                    <p className="pm-price">
                                        ${product.price.toFixed(2)}
                                        {product.originalPrice && product.originalPrice > product.price && (
                                            <span className="pm-old-price">${product.originalPrice.toFixed(2)}</span>
                                        )}
                                    </p>
                                    <p>{product.description}</p>
                                    {product.features.length > 0 && (
                                        <ul>{product.features.map((f, i) => <li key={i}>{f}</li>)}</ul>
                                    )}
                                    {product.shades.length > 0 && (
                                        <p><strong>Shades:</strong> {product.shades.join(', ')}</p>
                                    )}
                                </div>
                                <div className="pm-card-actions">
                                    <button onClick={() => handleEditProduct(product)}>Edit</button>
                                    <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductManagement;
