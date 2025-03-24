import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../ComponentsCss/NavBar.css";

function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSolid, setIsSolid] = useState(false);
  const isLoggedIn = false;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const pageHeight = document.body.scrollHeight - window.innerHeight;
      setIsSolid(scrollY / pageHeight > 0.05);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`navbar-header ${isSolid ? "solid" : ""}`}>
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/" className="logo-link">
            Lychee
          </Link>
        </div>

        <nav className="desktop-nav">
          <ul className="nav-links">
            <li>
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>
            <li>
              <Link to="/shops" className="nav-link">
                Shops
              </Link>
            </li>
            <li>
              <Link to="/collections" className="nav-link">
                Collections
              </Link>
            </li>
            <li>
              <div className="cart-container">
                <Link to="/shoppingcart" className="nav-link">
                  Cart
                </Link>
                <span className="cart-count">5</span>
              </div>
            </li>
          </ul>
        </nav>

        <div className="auth-section">
          {isLoggedIn ? (
            <Link to="/profile" className="nav-link profile-link">
              <span className="profile-icon">P</span> Profile
            </Link>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/signup" className="nav-link">
                Sign Up
              </Link>
            </>
          )}
        </div>

        <div className="mobile-menu-button" onClick={toggleMenu}>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </div>
      </div>

      {isMenuOpen && (
        <div className="mobile-menu">
          <ul className="mobile-nav-links">
            <li>
              <Link to="/" className="mobile-nav-link">
                Home
              </Link>
            </li>
            <li>
              <Link to="/shops" className="mobile-nav-link">
                Shops
              </Link>
            </li>
            <li>
              <Link to="/collections" className="mobile-nav-link">
                Collections
              </Link>
            </li>
            <li>
              <Link to="/shoppingcart" className="mobile-nav-link">
                Cart
              </Link>
            </li>
            {!isLoggedIn ? (
              <>
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
              </>
            ) : (
              <li>
                <Link to="/profile" className="mobile-nav-link">
                  Profile
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}

export default NavBar;
