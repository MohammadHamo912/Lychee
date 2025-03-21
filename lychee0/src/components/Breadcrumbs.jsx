// src/components/Breadcrumbs.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../ComponentsCss/Breadcrumbs.css";

const Breadcrumbs = ({ paths }) => {
  return (
    <nav className="breadcrumbs">
      {paths.map((path, index) => (
        <span key={index} className="breadcrumb-item">
          {index < paths.length - 1 ? (
            <>
              <Link to={path.url} className="breadcrumb-link">
                {path.label}
              </Link>
              <span className="breadcrumb-separator">/</span>
            </>
          ) : (
            <span className="breadcrumb-current">{path.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
