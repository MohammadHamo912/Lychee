// src/components/Toast.jsx
import React, { useEffect } from "react";
import "../ComponentsCss/Toast.css";

const Toast = ({
  message,
  type = "success",
  onClose,
  duration = 3000,
  position = "bottom-right",
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className={`toast toast-${type} toast-${position}`}>
      <span className="toast-message">{message}</span>
      <button
        className="toast-close"
        onClick={onClose}
        aria-label="Close toast"
      >
        ×
      </button>
    </div>
  );
};

export default Toast;
