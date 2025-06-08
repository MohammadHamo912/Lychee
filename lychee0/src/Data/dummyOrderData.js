/*export const dummyOrderData = {
  orderNumber: "ORD-12345",
  orderDate: "2025-03-20",
  shippingAddress: {
    name: "Jane Smith",
    street: "123 Main St",
    city: "Anytown",
    state: "CA",
    zip: "12345",
    country: "USA",
  },
  billingAddress: {
    name: "Jane Smith",
    street: "123 Main St",
    city: "Anytown",
    state: "CA",
    zip: "12345",
    country: "USA",
  },
  paymentMethod: {
    type: "Credit Card",
    last4: "4242",
  },
  items: [
    {
      id: 1,
      name: "Lip Gloss",
      imageUrl: "/images/lipgloss.jpeg",
      price: 9.99,
      quantity: 2,
      shop_name: "Beauty Shop",
    },
    {
      id: 2,
      name: "Mascara",
      imageUrl: "/images/mascara.jpeg",
      price: 14.99,
      quantity: 1,
      shop_name: "Beauty Shop",
    },
  ],
  subtotal: 34.97,
  tax: 3.5,
  shipping: 5.99,
  discount: 5.0,
  total: 39.46,
};
// dummyOrderData.js
*/
export const dummyOrderData = [
  {
    id: 101,
    date: "2024-03-01",
    total: 49.99,
    items: [
      {
        productName: "Lip Gloss",
        quantity: 2,
        price: 9.99,
      },
      {
        productName: "Mascara",
        quantity: 1,
        price: 29.99,
      },
    ],
  },
  {
    id: 102,
    date: "2024-02-15",
    total: 79.5,
    items: [
      {
        productName: "Foundation",
        quantity: 1,
        price: 39.5,
      },
      {
        productName: "Blush",
        quantity: 1,
        price: 40.0,
      },
    ],
  },
  {
    id: 103,
    date: "2024-01-20",
    total: 22.0,
    items: [
      {
        productName: "Eyeliner",
        quantity: 1,
        price: 22.0,
      },
    ],
  },
];
