import lipgloss from "../images/lipgloss.jpeg";
import mascara from "../images/mascara.png";
import placeholder_skincare from "../images/placeholder-skincare.png";
import placeholder_haircare from "../images/placeholder-haircare.jpg";
import placeholder_fragrances from "../images/placeholder-fragrances.jpg";

const dummyProducts = [
  {
    id: 1,
    name: "Lip Gloss",
    imageUrl: lipgloss,
    description: "30ml - Shimmering Rose",
    price: 9.99,
    shop_name: "Awesome Store",
  },
  {
    id: 2,
    name: "Mascara",
    imageUrl: mascara,
    description: "45ml - Volumizing Black",
    price: 19.99,
    shop_name: "Fashion Hub",
  },
  {
    id: 3,
    name: "Moisturizer",
    imageUrl: placeholder_skincare,
    description: "50ml - Hydrating Cream",
    price: 24.99,
    shop_name: "Glow Essentials",
  },
  {
    id: 4,
    name: "Hair Serum",
    imageUrl: placeholder_haircare,
    description: "100ml - Shine Boost",
    price: 15.5,
    shop_name: "Luxe Locks",
  },
  {
    id: 5,
    name: "Perfume",
    imageUrl: placeholder_fragrances,
    description: "75ml - Floral Bliss",
    price: 39.99,
    shop_name: "Scent Haven",
  },
  {
    id: 6,
    name: "Eyeshadow Palette",
    imageUrl: placeholder_skincare, // Replace with actual image if available
    description: "12 Shades - Warm Tones",
    price: 29.99,
    shop_name: "Beauty Boutique",
  },
];

export default dummyProducts;
