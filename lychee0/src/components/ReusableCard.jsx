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
<<<<<<< HEAD
=======
          onError={(e) => {
            console.error("Image failed to load:", e.target.src);
            e.target.style.display = "none"; // Hide broken image
          }}
          onLoad={() => {
            console.log("Image loaded successfully:", image);
          }}
>>>>>>> d1474035a0413c9afbf4e465f915032571632aad
        />
      )}

      <div className="reusable-card-body">
        {title && <h3 className="reusable-card-title">{title}</h3>}
        {subtitle && <div className="reusable-card-subtitle">{subtitle}</div>}
        {description && (
          <div className="reusable-card-description">{description}</div>
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
