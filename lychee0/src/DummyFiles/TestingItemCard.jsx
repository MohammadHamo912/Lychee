// ItemCard.js
import React from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import ReusableCard from "./../components/ReusableCard";
import "./TestingItemCard.css"; // For item-specific styling

const TestingItemCard = ({ item, onAction }) => {
  const navigate = useNavigate();
  const { id, name, imageUrl, description, category, actionLabel } = item;

  const handleCardClick = () => {
    navigate(`/item/${id}`);
  };

  const handleAction = (e) => {
    e.stopPropagation(); // Prevent navigation
    onAction(item);
  };

  const ActionButton = actionLabel ? (
    <button
      className="item-card-button"
      onClick={handleAction}
      aria-label={actionLabel}
    >
      {actionLabel}
    </button>
  ) : null;

  const CategoryLabel = category ? (
    <span className="item-card-category">{category}</span>
  ) : null;

  return (
    <ReusableCard
      image={imageUrl}
      imageAlt={name}
      title={name}
      description={description}
      footerLeft={CategoryLabel}
      footerRight={ActionButton}
      onClick={handleCardClick}
      className="item-theme"
    />
  );
};

TestingItemCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    title: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    category: PropTypes.string,
    actionLabel: PropTypes.string,
  }).isRequired,
  onAction: PropTypes.func.isRequired,
};

export default TestingItemCard;
