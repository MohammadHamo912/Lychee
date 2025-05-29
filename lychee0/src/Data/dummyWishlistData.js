export const dummyWishlistData = [
    {
        id: 1,
        name: 'Lip Gloss',
        imageUrl: '/images/lipgloss.jpeg', // Ensure this image is in your public folder or adjust accordingly
        price: 9.99,
        originalPrice: 14.99, // Indicates a price drop alert should be shown
    },
    {
        id: 2,
        name: 'Mascara',
        imageUrl: '/images/mascara.png',
        price: 19.99,
        // No originalPrice means no price drop alert
    },
    {
        id: 3,
        name: 'Eyeliner',
        imageUrl: '/images/eyeliner.jpeg', // Make sure this image exists
        price: 12.49,
        originalPrice: 15.00,
    },
    {
        id: 4,
        name: 'Foundation',
        imageUrl: '/images/foundation.jpeg', // Adjust path as needed
        price: 29.99,
        originalPrice: 29.99, // No drop if same
    },
];
