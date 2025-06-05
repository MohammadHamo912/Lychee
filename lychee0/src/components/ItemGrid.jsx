import React, { useState, useEffect } from "react";
import ReusableGrid from "../components/ReusableGrid";
import ItemCard from "../components/ItemCard";
import { getAllItems, getTrendingItems } from "../api/items";
import { useUser } from "../context/UserContext";

const ItemGrid = ({
  limit,
  header = "Explore Items",
  storeId = null,
  category = null,
  className = "items-grid",
}) => {
  const [items, setItems] = useState([]);
  const [allItems, setAllItems] = useState([]); // Store all items for cross-referencing
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get the addToCart function from UserContext
  const { addToCart, isAddingToCart } = useUser();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);

        // Always fetch all items for cross-referencing
        const allEnrichedItems = await getAllItems();
        setAllItems(allEnrichedItems);

        // Get the specific items to display
        let fetchedItems;
        if (className === "trending") {
          fetchedItems = await getTrendingItems();
        } else {
          fetchedItems = allEnrichedItems; // Use the already fetched items
        }

        // Apply filters
        let filteredItems = fetchedItems;

        if (storeId) {
          filteredItems = filteredItems.filter(
            (item) => item.storeId == storeId
          );
        }

        if (category) {
          // Note: Since categories aren't in enriched data, this filter might not work
          // You may need to remove this or add category info to your enriched endpoint
          filteredItems = filteredItems.filter(
            (item) => item.category === category
          );
        }

        setItems(filteredItems);
      } catch (err) {
        console.error("Error fetching items:", err);
        setError("Failed to load items. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [storeId, category, className]);

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
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
        <p>Loading items...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h3>Oops! Something went wrong</h3>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="retry-button"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="no-items-container">
        <h3>No items found</h3>
        <p>
          {storeId
            ? "No items available in this store."
            : category
            ? `No items found in the "${category}" category.`
            : "No items available at the moment."}
        </p>
      </div>
    );
  }

  return (
    <ReusableGrid
      headerContent={header}
      items={limit ? items.slice(0, limit) : items}
      CardComponent={ItemCard}
      cardProps={{
        onAddToCart: handleAddToCart,
        isAddingToCart, // Pass loading state to disable buttons during add
        allItems, // Pass all items for cross-referencing in ItemCard
      }}
      itemPropName="item"
      className={className}
      gridStyle={{ gap: "20px" }}
    />
  );
};

export default ItemGrid;
