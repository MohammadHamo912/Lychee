// src/components/WishlistPage.jsx
import React from 'react';
import Wishlist from '../components/WishList.jsx';
import { dummyWishlistData } from '../Data/dummyWishlistData';

const WishlistPage = () => {
    const handleRemoveFromWishlist = (id) => {
        console.log('Remove item with id:', id);
    };

    const handleViewProduct = (product) => {
        console.log('View product:', product);
    };

    return (
        <div>
            <Wishlist
                wishlistItems={dummyWishlistData}
                onRemoveFromWishlist={handleRemoveFromWishlist}
                onViewProduct={handleViewProduct}
            />
        </div>
    );
};

export default WishlistPage;
