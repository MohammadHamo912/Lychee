import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";

function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false); // Example state

  // const isLoggedIn = true

  const loggedInUser = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  return (
    <div style={{ width: "1200px", padding: "0 0 0 40px" }}>
      <header className="navbar-header">
        <div className="navbar-logo">
          <Link to="/" className="logo-link">
            Lychee
          </Link>
        </div>

        {/* Hamburger menu for mobile */}
        <div className="mobile-menu-button" onClick={toggleMenu}>
          <div className="hamburger-container">
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </div>
        </div>

        {/* Navigation links */}
        <div style={{ padding: " 0 0 0 300px" }}>
          <nav className="desktop-nav">
            <ul className="nav-links">
              <li>
                <Link to="/" className="nav-link">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="nav-link">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/collections" className="nav-link">
                  Collections
                </Link>
              </li>

              {/* Cart icon */}
              <div className="cart-container">
                <Link to="/cart" className="nav-link">
                  Cart
                </Link>
                <span className="cart-count">5</span>
              </div>
            </ul>
          </nav>
        </div>
        <div className="auth-section">
          {isLoggedIn ? (
            <li>
              <Link to="/profile" className="nav-link profile-link">
                <span className="profile-icon">
                  {/* You can use the user's initials or an icon here */}P
                </span>
                Profile
              </Link>
            </li>
          ) : (
            <>
              <li>
                <Link to="/login" className="nav-link">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/signup" className="nav-link">
                  Sign Up
                </Link>
              </li>
            </>
          )}
        </div>

        {/* Mobile menu dropdown */}
        {isMenuOpen && (
          <div className="mobile-menu">
            <ul className="mobile-nav-links">
              <li>
                <Link to="/" className="mobile-nav-link">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="mobile-nav-link">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/collections" className="mobile-nav-link">
                  Collections
                </Link>
              </li>
              <li>
                <Link to="/login" className="mobile-nav-link">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/signup" className="mobile-nav-link">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>
        )}

        {/* Add state for user authentication */}
      </header>
    </div>
  );
}

export default NavBar;
