import React from 'react';
import ShopCard from './ShopCard';
import '../ComponentsCss/ShopGrid.css';

// 1. Import the images from src/images
import shop1SampleImage from '../images/shop1SampleImage.png';
import shop2SampleImage from '../images/shop2SampleImage.jpeg';

const shops = [
  {
    id: 1,
    name: 'Awesome Store',
    logoUrl: shop1SampleImage, // 2. Use the imported image
    description: 'Your destination for trendy and high-quality products.',
  },
  {
    id: 2,
    name: 'Fashion Hub',
    logoUrl: shop2SampleImage,
    description: 'Discover the best fashion trends here.',
  },
];

const ShopGrid = () => {
  const handleViewShop = (shop) => {
    console.log('Viewing shop:', shop);
  };

  return (
    <div className="shop-grid">
      {shops.map((shop) => (
        <ShopCard
          key={shop.id}
          shop={shop}
          onViewShop={handleViewShop}
          featured={true}
        />
      ))}
    </div>
  );
};

export default ShopGrid;
