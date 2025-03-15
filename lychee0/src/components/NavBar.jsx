import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";

function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
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
      <nav className="desktop-nav">
        <ul className="nav-links">
          <li>
            <Link
              to="/"
              className="nav-link"
              onMouseOver={(e) => (e.target.style.color = "#B76E79")}
              onMouseOut={(e) => (e.target.style.color = "#D9B6A3")}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/shop"
              className="nav-link"
              onMouseOver={(e) => (e.target.style.color = "#B76E79")}
              onMouseOut={(e) => (e.target.style.color = "#D9B6A3")}
            >
              Shop
            </Link>
          </li>
          <li>
            <Link
              to="/collections"
              className="nav-link"
              onMouseOver={(e) => (e.target.style.color = "#B76E79")}
              onMouseOut={(e) => (e.target.style.color = "#D9B6A3")}
            >
              Collections
            </Link>
          </li>
          <li>
            <Link
              to="/login"
              className="nav-link"
              onMouseOver={(e) => (e.target.style.color = "#B76E79")}
              onMouseOut={(e) => (e.target.style.color = "#D9B6A3")}
            >
              Login
            </Link>
          </li>
          <li>
            <Link
              to="/signup"
              className="nav-link"
              onMouseOver={(e) => (e.target.style.color = "#B76E79")}
              onMouseOut={(e) => (e.target.style.color = "#D9B6A3")}
            >
              Sign Up
            </Link>
          </li>
        </ul>
      </nav>

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

      {/* Cart icon */}
      <div className="cart-container">
        <Link
          to="/cart"
          className="cart-link"
          onMouseOver={(e) => (e.target.style.color = "#B76E79")}
          onMouseOut={(e) => (e.target.style.color = "#8B3C5D")}
        >
          Cart
        </Link>
        <span className="cart-count">3</span>
      </div>
    </header>
  );
}

export default NavBar;
