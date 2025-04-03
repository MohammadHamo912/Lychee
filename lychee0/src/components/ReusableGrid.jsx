import React from "react";
import { Link } from "react-router-dom";
import "../ComponentsCss/ReusableGrid.css";

/**
 * A reusable grid component that can display any type of card components
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.headerContent - Content for the header section
 * @param {Array} props.items - Array of data items to be displayed
 * @param {React.ComponentType} props.CardComponent - Component to render for each item
 * @param {number} props.limit - Number of items to show (optional)
 * @param {Object} props.cardProps - Additional props to pass to each card component
 * @param {string} props.viewAllLink - URL for "View All" button
 * @param {string} props.viewAllText - Text for "View All" button (optional)
 * @param {string} props.className - Additional CSS class for the grid (optional)
 * @param {Object} props.gridContainerStyle - Additional inline style for container (optional)
 * @param {Object} props.gridStyle - Additional inline style for grid (optional)
 * @param {string} props.itemPropName - Name of the prop to pass each item as (default: "product")
 */
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
  itemPropName = "product", // Default to "product" to match your existing components
}) => {
  // Determine how many items to display
  const itemsToShow = limit ? items.slice(0, limit) : items;

  return (
    <div className="reusable-grid-container" style={gridContainerStyle}>
      {headerContent && (
        <div className="reusable-grid-header">{headerContent}</div>
      )}

      <div className={`reusable-grid ${className}`} style={gridStyle}>
        {itemsToShow.map((item, index) => {
          if (!item) return null;

          // Create dynamic props object where the item is passed with the specified prop name
          const dynamicProps = {
            [itemPropName]: item,
            ...cardProps,
            key: item.id || index,
          };

          return <CardComponent {...dynamicProps} />;
        })}
      </div>

      {limit && viewAllLink && items.length > limit && (
        <div className="view-all-container">
          <Link to={viewAllLink} className="view-all-link">
            {viewAllText}
          </Link>
        </div>
      )}
    </div>
  );
};

export default ReusableGrid;
