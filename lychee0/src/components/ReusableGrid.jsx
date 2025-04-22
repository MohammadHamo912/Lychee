// ReusableGrid.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../ComponentsCss/ReusableGrid.css";

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
  const itemsToShow = limit ? items.slice(0, limit) : items;

  return (
    <div className={`reusable-grid-container ${className}`} style={gridContainerStyle}>
      <div className="reusable-grid-header-container">
        {headerContent && <h2 className="reusable-grid-header">{headerContent}</h2>}
        {limit && viewAllLink && items.length > limit && (
          <Link to={viewAllLink} className="view-all-link">
            {viewAllText}
          </Link>
        )}
      </div>

      <div className="reusable-grid" style={gridStyle}>
        {itemsToShow.map((item, index) => {
          if (!item) return null;

          const dynamicProps = {
            [itemPropName]: item,
            rating: item.rating, // 👈 Pass rating
            ...cardProps,
            key: item.id || index,
          };

          return <CardComponent {...dynamicProps} />;
        })}
      </div>
    </div>
  );
};

export default ReusableGrid;
