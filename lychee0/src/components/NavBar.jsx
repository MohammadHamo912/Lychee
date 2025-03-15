import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./NavBar.css"; // You'll need to create this CSS file or use inline styles

function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header
      style={{
        padding: "20px 5%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#FFF5E1", // Creamy White background
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div
        style={{
          fontSize: "24px",
          fontWeight: 700,
          letterSpacing: "1px",
          color: "#8B3C5D", // Deep Berry for logo text
        }}
      >
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          ModernShop
        </Link>
      </div>

      {/* Hamburger menu for mobile */}
      <div
        className="mobile-menu-button"
        onClick={toggleMenu}
        style={{
          display: "none", // Hide by default, show on mobile via media query in CSS
          cursor: "pointer",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <span
            style={{
              display: "block",
              width: "24px",
              height: "2px",
              backgroundColor: "#8B3C5D",
            }}
          ></span>
          <span
            style={{
              display: "block",
              width: "24px",
              height: "2px",
              backgroundColor: "#8B3C5D",
            }}
          ></span>
          <span
            style={{
              display: "block",
              width: "24px",
              height: "2px",
              backgroundColor: "#8B3C5D",
            }}
          ></span>
        </div>
      </div>

      {/* Navigation links */}
      <nav className="desktop-nav" style={{ display: "block" }}>
        <ul
          style={{
            display: "flex",
            gap: "30px",
            listStyle: "none",
            margin: 0,
            padding: 0,
          }}
        >
          <li>
            <Link
              to="/"
              style={{
                color: "#D9B6A3", // Warm Taupe
                textDecoration: "none",
                transition: "color 0.3s",
              }}
              onMouseOver={(e) => (e.target.style.color = "#B76E79")} // Rose Gold on hover
              onMouseOut={(e) => (e.target.style.color = "#D9B6A3")}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/shop"
              style={{
                color: "#D9B6A3",
                textDecoration: "none",
                transition: "color 0.3s",
              }}
              onMouseOver={(e) => (e.target.style.color = "#B76E79")}
              onMouseOut={(e) => (e.target.style.color = "#D9B6A3")}
            >
              Shop
            </Link>
          </li>
          <li>
            <Link
              to="/collections"
              style={{
                color: "#D9B6A3",
                textDecoration: "none",
                transition: "color 0.3s",
              }}
              onMouseOver={(e) => (e.target.style.color = "#B76E79")}
              onMouseOut={(e) => (e.target.style.color = "#D9B6A3")}
            >
              Collections
            </Link>
          </li>
          <li>
            <Link
              to="/login"
              style={{
                color: "#D9B6A3",
                textDecoration: "none",
                transition: "color 0.3s",
              }}
              onMouseOver={(e) => (e.target.style.color = "#B76E79")}
              onMouseOut={(e) => (e.target.style.color = "#D9B6A3")}
            >
              Login
            </Link>
          </li>
          <li>
            <Link
              to="/signup"
              style={{
                color: "#D9B6A3",
                textDecoration: "none",
                transition: "color 0.3s",
              }}
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
        <div
          className="mobile-menu"
          style={{
            position: "absolute",
            top: "80px",
            left: 0,
            right: 0,
            backgroundColor: "#FFF5E1",
            padding: "20px",
            boxShadow: "0 5px 10px rgba(0, 0, 0, 0.1)",
            zIndex: 99,
          }}
        >
          <ul
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
              listStyle: "none",
              margin: 0,
              padding: 0,
            }}
          >
            <li>
              <Link to="/" style={{ color: "#D9B6A3", textDecoration: "none" }}>
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/shop"
                style={{ color: "#D9B6A3", textDecoration: "none" }}
              >
                Shop
              </Link>
            </li>
            <li>
              <Link
                to="/collections"
                style={{ color: "#D9B6A3", textDecoration: "none" }}
              >
                Collections
              </Link>
            </li>
            <li>
              <Link
                to="/login"
                style={{ color: "#D9B6A3", textDecoration: "none" }}
              >
                Login
              </Link>
            </li>
            <li>
              <Link
                to="/signup"
                style={{ color: "#D9B6A3", textDecoration: "none" }}
              >
                Sign Up
              </Link>
            </li>
          </ul>
        </div>
      )}

      {/* Cart icon */}
      <div style={{ position: "relative" }}>
        <Link
          to="/cart"
          style={{
            color: "#8B3C5D", // Deep Berry color
            textDecoration: "none",
            transition: "color 0.3s",
          }}
          onMouseOver={(e) => (e.target.style.color = "#B76E79")} // Rose Gold on hover
          onMouseOut={(e) => (e.target.style.color = "#8B3C5D")}
        >
          Cart
        </Link>
        <span
          style={{
            position: "absolute",
            top: "-8px",
            right: "-8px",
            backgroundColor: "#B76E79", // Rose Gold
            color: "white",
            borderRadius: "50%",
            width: "18px",
            height: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
          }}
        >
          3
        </span>
      </div>
    </header>
  );
}

export default NavBar;
