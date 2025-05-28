import React from "react";
import ReusableGrid from "./ReusableGrid";
import StoreCard from "./StoreCard";

const StoresGrid = ({
  stores = [], // Required prop for stores data
  title = "Featured Stores",
  limit,
  header,
  className = "",
  isLoading = false, // Loading state from parent
  error = null, // Error state from parent
  onRetry = null, // Retry function from parent
}) => {
  // Create header content for the grid
  const handleItemSelect = (item) => {
    console.log("Item selected:", item);
  };

  // Fix: Don't create nested h2 elements
  const headerContent =
    header != null ? (
      // If header is passed, use it as-is (it might already be an h2)
      header
    ) : (
      // Create the default header structure
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

  // Handle loading state
  if (isLoading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading stores...</p>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
        {onRetry && (
          <button onClick={onRetry} className="retry-btn">
            Retry
          </button>
        )}
      </div>
    );
  }

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
      itemPropName="store" // This matches the prop name in StoreCard
      gridStyle={{
        gap: "30px",
      }}
    />
  );
};

export default StoresGrid;
