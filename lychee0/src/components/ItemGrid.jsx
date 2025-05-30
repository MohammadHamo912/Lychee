import React, { useState, useEffect } from "react";
import ReusableGrid from "../components/ReusableGrid";
import ItemCard from "../components/ItemCard";
import { getAllItems, getTrendingItems } from "../api/items"; // Import the updated service

const ItemGrid = ({
  limit,
  header,
  storeId = null,
  category = null,
  className = "items-grid", // Accept className as prop with default value
}) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);

        let fetchedItems;

        // Fetch enriched items from API (now includes product data and variants)
        if (className === "trending") {
          fetchedItems = await getTrendingItems();
        } else {
          fetchedItems = await getAllItems();
        }
        // Apply filters if provided
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

  const handleAddToCart = (item) => {
    // This will be implemented later with actual cart functionality
    console.log("Add to cart:", item);
    // You can access all the enriched data here:
    console.log("Product name:", item.name);
    console.log("Current variant:", item.currentVariant);
    console.log("Available variants:", item.availableVariants);
  };

  if (loading) {
    return <div className="loading">Loading items...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (items.length === 0) {
    return <div className="no-items">No items found.</div>;
  }

  return (
    <ReusableGrid
      headerContent={<h2>{header}</h2>}
      items={limit ? items.slice(0, limit) : items}
      CardComponent={ItemCard}
      cardProps={{ onAddToCart: handleAddToCart }}
      itemPropName="item"
      className={className} // Use the className prop instead of hardcoded value
      gridStyle={{ gap: "20px" }}
    />
  );
};

export default ItemGrid;
