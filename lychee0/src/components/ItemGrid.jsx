// ItemGrid.jsx
import React from "react";
import ReusableGrid from "../components/ReusableGrid";
import ItemCard from "../components/ItemCard"; // You'll need to create this component
import dummyItems from "../Data/dummyProducts"; // You'll need to create this data file

const ItemGrid = ({ limit, header }) => {
  const handleItemSelect = (item) => {
    console.log("Item selected:", item);
  };

  return (
    <ReusableGrid
      headerContent={<h2>{header}</h2>}
      items={dummyItems}
      CardComponent={ItemCard}
      limit={limit}
      cardProps={{ onItemSelect: handleItemSelect }}
      viewAllLink="/items"
      viewAllText="Browse All Items"
      itemPropName="item" // This is the key change - passing "item" instead of "product"
      className="items-grid" // Optional custom class for styling specific to items
      // You can also add custom styling if needed
      gridStyle={{ gap: "20px" }}
    />
  );
};

export default ItemGrid;
