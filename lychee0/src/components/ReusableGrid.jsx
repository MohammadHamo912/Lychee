// ReusableGrid.jsx
import React, { useRef } from "react";
import { Link } from "react-router-dom";
import "../ComponentsCss/ReusableGrid.css";

// Global counter to ensure unique grid IDs across the entire application
let globalGridCounter = 0;

const ReusableGrid = ({
  headerContent,
  items = [],
  CardComponent,
  limit,
  cardProps = {},
  viewAllLink,
  viewAllText = "View All",
  className = "",
  gridContainerStyle = {},
  gridStyle = {},
  itemPropName = "product",
}) => {
  // Create a stable unique identifier for this grid instance that persists across re-renders
  const gridIdRef = useRef(null);
  if (gridIdRef.current === null) {
    globalGridCounter++;
    gridIdRef.current = `grid-instance-${globalGridCounter}-${Date.now()}`;
  }

  const itemsToShow = limit ? items.slice(0, limit) : items;

  return (
    <div
      className={`reusable-grid-container ${className}`}
      style={gridContainerStyle}
    >
      <div className="reusable-grid-header-container">
        {headerContent && (
          <div className="reusable-grid-header">
            {typeof headerContent === "string" ? (
              <h2>{headerContent}</h2>
            ) : (
              headerContent
            )}
          </div>
        )}
        {limit && viewAllLink && items.length > limit && (
          <Link to={viewAllLink} className="view-all-link">
            {viewAllText}
          </Link>
        )}
      </div>

      <div className="reusable-grid" style={gridStyle}>
        {itemsToShow.map((item, index) => {
          if (!item) return null;

          // Create props object without the key
          const dynamicProps = {
            [itemPropName]: item,
            rating: item.rating, // Pass rating
            ...cardProps,
          };

          // Create absolutely unique key by combining multiple unique identifiers
          const itemId =
            item.id ||
            item.item_id ||
            item.product_id ||
            item.storeId ||
            item.store_id ||
            item.itemId ||
            item.productId;
          const uniqueKey = `${gridIdRef.current}-${className}-item-${
            itemId || index
          }-${index}`;

          return <CardComponent key={uniqueKey} {...dynamicProps} />;
        })}
      </div>
    </div>
  );
};

export default ReusableGrid;
