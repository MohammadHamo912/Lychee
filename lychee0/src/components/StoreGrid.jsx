import React from "react";
import ReusableGrid from "./ReusableGrid";
import StoreCard from "./StoreCard";
import dummyStores from "./../Data/dummyStores";
let stores = dummyStores;

const StoresGrid = ({
  title = "Featured Stores",
  limit,
  header,
  className,
}) => {
  // Create header content for the grid
  const handleItemSelect = (item) => {
    console.log("Item selected:", item);
  };
  const headerContent =
    header != null ? (
      header
    ) : (
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
  className = className == null ? "" : className;
  return (
    <ReusableGrid
      headerContent={headerContent}
      items={stores}
      CardComponent={StoreCard}
      limit={limit}
      cardProps={{ onItemSelect: handleItemSelect }}
      viewAllLink="/allstorespage"
      viewAllText="View All Stores"
      className={className}
      itemPropName="store" // This matches the prop name in StoreCardComponent
      gridStyle={{
        gap: "30px",
      }}
    />
  );
};

export default StoresGrid;
