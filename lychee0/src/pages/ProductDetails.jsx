import React, { useState } from 'react';
import '../PagesCss/ProductDetails.css';
import productImg from '../images/lipgloss.jpeg';

const ProductDetails = ({ product }) => {
    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = () => {
        console.log(`Added ${quantity} of ${product.name} to cart`);
    };

    const handleBuyNow = () => {
        console.log(`Buying now: ${quantity} of ${product.name}`);
    };

    return (
        <div className="product-details-container">
            {/* Left Side - Image */}
            <div className="product-image-block">
                <img src={productImg} alt={product.name} />
            </div>

            {/* Right Side - Details */}
            <div className="product-info-block">
                <div>
                    <h1>{product.name}</h1>
                    <p className="product-brand">Brand: {product.brand || 'Unknown'}</p>
                    <p className="product-price">${product.price.toFixed(2)}</p>
                    <p className="product-description">{product.description}</p>

                    <div className="product-action-row">
                        <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                        />
                        <button className="add-to-cart-btn" onClick={handleAddToCart}>
                            Add to Cart
                        </button>
                        <button className="buy-now-btn" onClick={handleBuyNow}>
                            Find Best Price
                        </button>
                    </div>
                </div>

                <div className="reviews-section">
                    <h2>Customer Reviews</h2>
                    {product.reviews && product.reviews.length > 0 ? (
                        product.reviews.map((review, index) => (
                            <div key={index} className="review-item">{review}</div>
                        ))
                    ) : (
                        <p className="review-item">No reviews yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
