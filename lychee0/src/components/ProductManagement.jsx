import React, { useState, useEffect } from 'react';
import FiltersPanel from '../components/FiltersPanel';
import '../ComponentsCss/ProductManagement.css';

const categories = ['Makeup', 'Skincare', 'Fragrance', 'Hair', 'Other'];

const ProductManagement = () => {
    const [products, setProducts] = useState([
        {
            id: 1,
            name: "Shimmering Rose Lip Gloss",
            category: "Makeup",
            imageUrl: "/images/lipgloss.jpeg",
            images: ["/images/lipgloss.jpeg"],
            description: "30ml - Adds a glossy shine with a rose tint",
            price: 9.99,
            originalPrice: 12.99,
            shop_name: "Awesome Store",
            rating: 4.5,
            reviews: 87,
            discount: "23%",
            isNew: true,
            isBestseller: false,
            features: ["Long-lasting shine", "Hydrating formula", "Non-sticky"],
            howToUse: "Apply evenly to lips with the applicator.",
            ingredients: "Castor Oil, Silica, Rose Extract",
            shades: ["Rose", "Pink", "Nude"],
            inStock: true,
        },
    ]);

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        originalPrice: '',
        description: '',
        category: '',
        imageFile: null,
        imageUrl: '',
        features: '',
        howToUse: '',
        ingredients: '',
        shades: '',
        shop_name: 'Awesome Store',
        rating: 0,
        reviews: 0,
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
        const {
            name, price, originalPrice, description, imageFile, imageUrl, category,
            features, howToUse, ingredients, shades
        } = formData;

        if (!name || !price || !description || !category || (!imageFile && !editingProduct)) {
            alert('Please fill out all required fields and upload an image.');
            return;
        }

        const parsedShades = shades ? shades.split(',').map(s => s.trim()) : null;
        const parsedFeatures = features ? features.split('\n').map(f => f.trim()).filter(Boolean) : [];

        const discount = originalPrice && parseFloat(originalPrice) > parseFloat(price)
            ? `${Math.round((1 - price / originalPrice) * 100)}%`
            : null;

        const newProduct = {
            ...formData,
            price: parseFloat(price),
            originalPrice: originalPrice ? parseFloat(originalPrice) : null,
            discount,
            features: parsedFeatures,
            shades: parsedShades,
            reviews: parseInt(formData.reviews),
            rating: parseFloat(formData.rating),
        };

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

        resetForm();
    };

    const resetForm = () => {
        setFormData({
            name: '',
            price: '',
            originalPrice: '',
            description: '',
            category: '',
            imageFile: null,
            imageUrl: '',
            features: '',
            howToUse: '',
            ingredients: '',
            shades: '',
            shop_name: 'Awesome Store',
            rating: 0,
            reviews: 0,
        });
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setFormData({
            ...product,
            features: product.features?.join('\n') || '',
            shades: product.shades?.join(', ') || '',
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
        resetForm();
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
                        <input type="number" name="originalPrice" step="0.01" placeholder="Original Price" value={formData.originalPrice} onChange={handleInputChange} />
                    </div>

                    <select name="category" value={formData.category} onChange={handleInputChange} className="category-select" required>
                        <option value="">Choose a category</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>

                    <textarea name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} required />
                    <textarea name="features" placeholder="Features (one per line)" value={formData.features} onChange={handleInputChange} />
                    <input type="text" name="shades" placeholder="Shades (comma-separated)" value={formData.shades} onChange={handleInputChange} />
                    <input type="text" name="ingredients" placeholder="Ingredients" value={formData.ingredients} onChange={handleInputChange} />
                    <textarea name="howToUse" placeholder="How to Use" value={formData.howToUse} onChange={handleInputChange} />

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

            {/* Sidebar + Grid */}
            <div className="product-content-layout">
                <div className="filters-sidebar">
                    <FiltersPanel onApplyFilters={applyFilters} categories={categories} />
                </div>

                <div className="product-grid">
                    {filteredResults.length === 0 ? (
                        <p className="no-products">No products found.</p>
                    ) : (
                        filteredResults.map((product) => (
                            <div key={product.id} className={`product-card ${editingProduct?.id === product.id ? 'editing' : ''}`}>
                                <img src={product.imageUrl} alt={product.name} className="product-image" />
                                <div className="product-details">
                                    <h3>{product.name}</h3>
                                    <p className="product-category">{product.category}</p>
                                    <p className="product-price">
                                        ${product.price.toFixed(2)}
                                        {product.originalPrice && product.originalPrice > product.price && (
                                            <span style={{ textDecoration: 'line-through', marginLeft: 6, fontSize: '0.9rem', color: '#B76E79' }}>
                                                ${product.originalPrice.toFixed(2)}
                                            </span>
                                        )}
                                    </p>
                                    <p className="product-desc">{product.description}</p>
                                    {product.features?.length > 0 && (
                                        <ul className="product-features">
                                            {product.features.map((f, idx) => <li key={idx}>{f}</li>)}
                                        </ul>
                                    )}
                                    {product.shades && <p><strong>Shades:</strong> {product.shades.join(', ')}</p>}
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
        </div>
    );
};

export default ProductManagement;
