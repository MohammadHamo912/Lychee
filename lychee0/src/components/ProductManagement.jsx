import React, { useState } from 'react';
import '../ComponentsCss/ProductManagement.css';

const ProductManagement = () => {
    const [products, setProducts] = useState([
        {
            id: 1,
            name: 'Lip Gloss',
            price: 9.99,
            description: 'A high-quality lip gloss that adds shine and hydration.',
            imageUrl: '/images/lipgloss.jpeg',
        },
    ]);

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        imageFile: null,
        imageUrl: '',
    });

    const [editingProduct, setEditingProduct] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                imageFile: file,
                imageUrl: URL.createObjectURL(file),
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.imageFile && !editingProduct) {
            alert("Please upload an image!");
            return;
        }

        if (editingProduct) {
            setProducts(products.map(prod => prod.id === editingProduct.id ? { ...editingProduct, ...formData, price: parseFloat(formData.price) } : prod));
            setEditingProduct(null);
        } else {
            const newProduct = {
                id: Date.now(),
                name: formData.name,
                price: parseFloat(formData.price),
                description: formData.description,
                imageUrl: formData.imageUrl,
            };
            setProducts([...products, newProduct]);
        }

        setFormData({
            name: '',
            price: '',
            description: '',
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
            imageFile: null,
            imageUrl: product.imageUrl,
        });
    };

    const handleDeleteProduct = (id) => {
        setProducts(products.filter(prod => prod.id !== id));
    };

    return (
        <div className="product-management-container">
            <h2>Product Management</h2>

            <div className="product-form-card">
                <h3>{editingProduct ? "Edit Product" : "Add New Product"}</h3>
                <form className="product-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Product Name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        type="number"
                        step="0.01"
                        name="price"
                        placeholder="Price"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                    />
                    <textarea
                        name="description"
                        placeholder="Description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                    {formData.imageUrl && (
                        <img src={formData.imageUrl} alt="Preview" className="image-preview" />
                    )}
                    <button type="submit">
                        {editingProduct ? "Update Product" : "Add Product"}
                    </button>
                </form>
            </div>

            <div className="product-list">
                {products.map((product) => (
                    <div key={product.id} className="product-card">
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="product-image"
                        />
                        <div className="product-details">
                            <h3>{product.name}</h3>
                            <p>${product.price.toFixed(2)}</p>
                            <p>{product.description}</p>
                        </div>
                        <div className="product-actions">
                            <button onClick={() => handleEditProduct(product)}>Edit</button>
                            <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductManagement;
