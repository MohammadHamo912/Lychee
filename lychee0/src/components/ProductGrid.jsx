import React from 'react';
import ProductCard from './ProductCard';
import '../ComponentsCss/ProductGrid.css';
import lipgloss from '../images/lipgloss.jpeg';
import mascara from '../images/mascara.png';

const products = [
    {
        id: 1,
        name: 'Lip Gloss',
        imageUrl: lipgloss,
        description: '30ml',
        price: 9.99,
        shop_name: 'Awesome Store',
    },
    {
        id: 2,
        name: 'Mascara',
        imageUrl: mascara,
        description: '45ml',
        price: 19.99,
        shop_name: 'Fashion Hub',
    }
];

const ProductGrid = () => {
    const handleAddToCart = (product) => {
        console.log('Added to cart:', product);
    };

    return (
        <div className="product-grid">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
            ))}
        </div>
    );
};

export default ProductGrid;
