// src/components/Spinner.jsx
import React from "react";
import "../ComponentsCss/Spinner.css";

const Spinner = ({
  size = 40,
  color = "#8b3c5d",
  thickness = 4,
  speed = "1s",
}) => {
  return (
    <div className="spinner" style={{ width: size, height: size }}>
      <div
        className="spinner-inner"
        style={{
          border: `${thickness}px solid`,
          borderColor: `${color} transparent transparent transparent`,
          animationDuration: speed,
        }}
      ></div>
    </div>
  );
};

export default Spinner;
