import skincarePlaceholder from "../images/placeholder-skincare.png";
import haircarePlaceholder from "../images/placeholder-haircare.jpg";
import makeupPlaceholder from "../images/placeholder-makeup.jpg";
import fragrancePlaceholder from "../images/placeholder-fragrances.jpg";
import dummyProducts from "./dummyProducts"; // Import your products

const dummyCategories = [
  {
    id: 1,
    name: "skincare",
    displayName: "Skincare",
    description:
      "Discover premium skincare products designed to hydrate, nourish, and rejuvenate your skin.",
    image: skincarePlaceholder,
    subcategories: ["Face Moisturizers", "Cleansers", "Serums", "Night Creams"],
    productCount: 0, // Will be calculated dynamically
  },
  {
    id: 2,
    name: "haircare",
    displayName: "Haircare",
    description:
      "Explore our range of haircare essentials to strengthen, hydrate, and add shine to your locks.",
    image: haircarePlaceholder,
    subcategories: ["Shampoos", "Conditioners", "Serums", "Oils"],
    productCount: 0,
  },
  {
    id: 3,
    name: "makeup",
    displayName: "Makeup",
    description:
      "Enhance your beauty with our curated selection of makeup products for every occasion.",
    image: makeupPlaceholder,
    subcategories: [
      "Lip Gloss",
      "Mascara",
      "Eyeshadow",
      "Foundation",
      "Blush",
      "Lipstick",
      "Eyeliner",
    ],
    productCount: 0,
  },
  {
    id: 4,
    name: "fragrances",
    displayName: "Fragrances",
    description:
      "Find your signature scent with our collection of luxurious perfumes and body mists.",
    image: fragrancePlaceholder,
    subcategories: ["Perfumes", "Body Mists", "Eau de Parfum"],
    productCount: 0,
  },
];

// Function to calculate product count per category based on dummyProducts
const populateProductCounts = (categories, products) => {
  return categories.map((category) => {
    const count = products.filter((product) =>
      category.subcategories.some((subcat) => product.name.includes(subcat))
    ).length;
    return { ...category, productCount: count };
  });
};

const dummyCategoriesWithCounts = populateProductCounts(
  dummyCategories,
  dummyProducts
);

export default dummyCategoriesWithCounts;
