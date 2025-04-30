import React, { useState, useEffect } from 'react';
import FiltersPanel from '../components/FiltersPanel';
import '../ComponentsCss/ProductManagement.css';
import { getAllProducts, createProduct } from '../api/products';

const categories = ['Makeup', 'Skincare', 'Fragrance', 'Hair', 'Other'];

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [filteredResults, setFilteredResults] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [filters, setFilters] = useState({ category: 'All', minPrice: '', maxPrice: '', sortOption: '' });

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        imageFile: null,
        imageUrl: '',
        features: [],
        newFeature: '',
        shades: [],
        newShade: '',
        barcode: '',
        brandName: '',
    });

    useEffect(() => {
        getAllProducts().then((data) => {
            console.log("🚀 Backend response:", data);
            setProducts(data);
            setFilteredResults(data);
        });
    }, []);


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
            description: '',
            category: '',
            imageFile: null,
            imageUrl: '',
            features: [],
            newFeature: '',
            shades: [],
            newShade: '',
            barcode: '',
            brandName: '',
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, description, barcode } = formData;

        if (!name) {
            alert('Name is required.');
            return;
        }

        const newProduct = { name, description, barcode };

        try {
            const saved = await createProduct(newProduct);
            const updatedList = [...products, saved];
            setProducts(updatedList);
            setFilteredResults(updatedList);
            resetForm();
        } catch (error) {
            alert('Failed to create product.');
        }
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setFormData({ ...product, newFeature: '', newShade: '' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteProduct = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            const updated = products.filter((p) => (p.productId ?? p.id) !== id);
            setProducts(updated);
            setFilteredResults(updated);
        }
    };

    const handleCancelEdit = () => {
        setEditingProduct(null);
        resetForm();
    };

    const applyFilters = (filters) => {
        // Filtering logic is disabled for now
        setFilteredResults(products);
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
                        <input name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} />
                    </div>

                    <select name="category" value={formData.category} onChange={handleInputChange}>
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>

                    <div className="pm-form-group">
                        <input name="barcode" placeholder="Barcode" value={formData.barcode} onChange={handleInputChange} />
                        <input name="brandName" placeholder="Brand Name" value={formData.brandName} onChange={handleInputChange} />
                    </div>

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
                            <div key={product.productId ?? product.id} className="pm-card">
                                <img src={product.imageUrl || '/placeholder.jpg'} alt={product.name} className="pm-card-img" />
                                <div className="pm-card-body">
                                    <h4>{product.name}</h4>
                                    <p>{product.description}</p>
                                    <p><strong>Barcode:</strong> {product.barcode}</p>
                                </div>
                                <div className="pm-card-actions">
                                    <button onClick={() => handleEditProduct(product)}>Edit</button>
                                    <button onClick={() => handleDeleteProduct(product.productId ?? product.id)}>Delete</button>
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
