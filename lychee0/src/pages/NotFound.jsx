import React from 'react';
import '../PagesCss/NotFound.css';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleContactSupport = () => {
    // You can navigate to a support page or open an email client, etc.
    // For example:
    // navigate('/support');
    //window.open('mailto:support@yourdomain.com', '_blank');
  };

  return (
    <div className="not-found-container">
      <div className="not-found-card">
        <h1 className="not-found-title">404</h1>
        <p className="not-found-message">Oops! Page not found.</p>
        <p className="not-found-subtext">
          The page you’re looking for doesn’t exist or has been moved.
        </p>
        <div className="not-found-buttons">
          <button className="button primary-button" onClick={handleGoHome}>
            Go back Home
          </button>
          <button className="button secondary-button" onClick={handleContactSupport}>
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
