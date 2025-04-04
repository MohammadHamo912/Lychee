// ReusableCard.js
import React from "react";
import PropTypes from "prop-types";
import "./../ComponentsCss/ReusableCard.css";

const ReusableCard = ({
  image,
  imageAlt,
  title,
  subtitle,
  description,
  footerLeft,
  footerRight,
  onClick,
  children,
  className = "",
}) => {
  const handleCardClick = () => {
    if (onClick) onClick();
  };

  return (
    <div className={`reusable-card ${className}`} onClick={handleCardClick}>
      {image && (
        <img
          src={image}
          alt={imageAlt || title}
          className="reusable-card-image"
        />
      )}

      <div className="reusable-card-body">
        {title && <h3 className="reusable-card-title">{title}</h3>}
        {subtitle && <p className="reusable-card-subtitle">{subtitle}</p>}
        {description && (
          <p className="reusable-card-description">{description}</p>
        )}

        {children}

        {(footerLeft || footerRight) && (
          <div className="reusable-card-footer">
            {footerLeft && <div className="footer-left">{footerLeft}</div>}
            {footerRight && <div className="footer-right">{footerRight}</div>}
          </div>
        )}
      </div>
    </div>
  );
};

ReusableCard.propTypes = {
  image: PropTypes.string,
  imageAlt: PropTypes.string,
  title: PropTypes.node,
  subtitle: PropTypes.node,
  description: PropTypes.node,
  footerLeft: PropTypes.node,
  footerRight: PropTypes.node,
  onClick: PropTypes.func,
  children: PropTypes.node,
  className: PropTypes.string,
};

export default ReusableCard;
