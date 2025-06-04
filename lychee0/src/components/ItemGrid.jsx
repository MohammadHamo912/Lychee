import React, { useState, useEffect } from "react";
import ReusableGrid from "../components/ReusableGrid";
import ItemCard from "../components/ItemCard";
import { getAllItems, getTrendingItems } from "../api/items";
import { useUser } from "../context/UserContext"; // Import the custom hook

const ItemGrid = ({
  limit,
  header = "Explore Items",
  storeId = null,
  category = null,
  className = "items-grid",
}) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get the addToCart function from UserContext
  const { addToCart, isAddingToCart } = useUser();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);

        let fetchedItems;
        if (className === "trending") {
          fetchedItems = await getTrendingItems();
        } else {
          fetchedItems = await getAllItems();
        }

        if (storeId) {
          fetchedItems = fetchedItems.filter((item) => item.storeId == storeId);
        }

        if (category) {
          fetchedItems = fetchedItems.filter(
            (item) => item.category === category
          );
        }

        setItems(fetchedItems);
      } catch (err) {
        console.error("Error fetching items:", err);
        setError("Failed to load items. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [storeId, category]);

  // Handle add to cart function
  const handleAddToCart = async (item) => {
    const success = await addToCart(item);
    if (success) {
      // Optional: Show success message or update UI
      console.log(`${item.name} added to cart successfully!`);
    } else {
      // Optional: Show error message
      console.error(`Failed to add ${item.name} to cart`);
    }
  };

  if (loading) {
    return <div>Loading items...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (items.length === 0) {
    return <div>No items found.</div>;
  }

  return (
    <ReusableGrid
      headerContent={header}
      items={limit ? items.slice(0, limit) : items}
      CardComponent={ItemCard}
      cardProps={{
        onAddToCart: handleAddToCart,
        isAddingToCart, // Pass loading state to disable buttons during add
      }}
      itemPropName="item"
      className={className}
      gridStyle={{ gap: "20px" }}
    />
  );
};

export default ItemGrid;
