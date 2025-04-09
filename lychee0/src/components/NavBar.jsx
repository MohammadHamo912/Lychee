import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../ComponentsCss/NavBar.css";

const NavBar = () => {
  const [opacity, setOpacity] = useState(1);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const threshold = 150; // adjust how quickly opacity fades

      const newOpacity = Math.max(0, 1 - scrollY / threshold);
      setOpacity(newOpacity);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isLoggedIn = true; // Replace with actual authentication logic

  return (
    <>
      <header className="navbar" style={{ opacity }}>
        <div className="navbar-inner">
          {/* Logo */}
          <Link to="/" className="logo">
            Lychee
          </Link>

          {/* Desktop Nav Links */}
          <nav className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/shops">Shops</Link>
            <Link to="/products">Products</Link>
            <Link to="/categories">Categories</Link>
            <Link to="/shoppingcart" className="cart-link">
              Cart <span className="cart-badge">5</span>
            </Link>
          </nav>

          {/* Auth/Profile Links */}
          <div className="nav-auth">
            {isLoggedIn ? (
              <Link to="/dashboard" className="profile-link">
                <span className="profile-badge">P</span>
                Profile
              </Link>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/signup">Sign Up</Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            className="mobile-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu Content */}
        {isMenuOpen && (
          <div className="mobile-menu">
            <Link to="/">Home</Link>
            <Link to="/shops">Shops</Link>
            <Link to="/products">Products</Link>
            <Link to="/categories">Categories</Link>
            <Link to="/shoppingcart">Cart</Link>
            {isLoggedIn ? (
              <Link to="/dashboard">Profile</Link>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/signup">Sign Up</Link>
              </>
            )}
          </div>
        )}
      </header>
    </>
  );
};

export default NavBar;
