import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../ComponentsCss/NavBar.css";

const NavBar = () => {
  const [isSolid, setIsSolid] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isLoggedIn = true;

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const height = document.body.scrollHeight - window.innerHeight;
      setIsSolid(scrollY / height > 0.05);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`navbar ${isSolid ? "solid" : ""}`}>
      <div className="navbar-inner">
        <Link to="/" className="logo">Lychee</Link>

        <nav className="nav-links">
          <Link to="/homepage">Home</Link>
          <Link to="/shops">Shops</Link>
          <Link to="/collections">Collections</Link>
          <Link to="/shoppingcart" className="cart-link">
            Cart <span className="cart-badge">5</span>
          </Link>
        </nav>

        <div className="nav-auth">
          {isLoggedIn ? (
            <Link to="/dashboard" className="profile-link">
              <span className="profile-badge">P</span> Profile
            </Link>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign Up</Link>
            </>
          )}
        </div>

        <div className="mobile-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          ☰
        </div>
      </div>

      {isMenuOpen && (
        <div className="mobile-menu">
          <Link to="/homepage">Home</Link>
          <Link to="/shops">Shops</Link>
          <Link to="/collections">Collections</Link>
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
  );
};

export default NavBar;
