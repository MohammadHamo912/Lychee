import React from "react";
import { Link } from "react-router-dom";
import ReusableGrid from "./ReusableGrid";
import StoreCard from "./StoreCard";
import dummyStores from "./../Data/dummyStores";
let stores = dummyStores;

const StoresGrid = ({ title = "Featured Stores", limit }) => {
  // Create header content for the grid
  const handleItemSelect = (item) => {
    console.log("Item selected:", item);
  };
  const headerContent = (
    <div>
      <h2>{title}</h2>
      <p
        style={{
          color: "#777",
          fontSize: "1rem",
          marginTop: "-20px",
          marginBottom: "20px",
          textAlign: "center",
        }}
      >
        Discover unique beauty brands from around the world
      </p>
    </div>
  );

  return (
    <ReusableGrid
      headerContent={headerContent}
      items={stores}
      CardComponent={StoreCard}
      limit={limit}
      cardProps={{ onItemSelect: handleItemSelect }}
      viewAllLink="/allstorespage" 
      viewAllText="View All Stores"
      className="stores-grid"
      itemPropName="store" // This matches the prop name in StoreCardComponent
      gridStyle={{
        gap: "30px",
      }}
    />
  );
};

export default StoresGrid;
