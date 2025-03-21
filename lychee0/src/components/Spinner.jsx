// src/components/Spinner.jsx
import React from "react";
import "../ComponentsCss/Spinner.css";

const Spinner = ({ size = 40, color = "#8b3c5d" }) => {
  return (
    <div className="spinner" style={{ width: size, height: size }}>
      <div
        className="spinner-inner"
        style={{ borderColor: `${color} transparent transparent transparent` }}
      ></div>
    </div>
  );
};

export default Spinner;
