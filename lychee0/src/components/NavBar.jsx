import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../ComponentsCss/NavBar.css";
import { useUser } from "../context/UserContext";

const NavBar = () => {
  const [opacity, setOpacity] = useState(1);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isLoggedIn, logout, cartCount, isLoadingCart } = useUser();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const threshold = 150;
      const newOpacity = Math.max(0, 1 - scrollY / threshold);
      setOpacity(newOpacity);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      logout();
      window.location.href = "/login";
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // Debug logs
  console.log("NavBar - User:", user);
  console.log("NavBar - isLoggedIn:", isLoggedIn);
  console.log("NavBar - cartCount:", cartCount);

  return (
    <header className="navbar" style={{ opacity }}>
      <div className="navbar-inner">
        <Link to="/" className="logo">
          Lychee
        </Link>

        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/allstorespage">Shops</Link>
          <Link to="/productlistingpage">Products</Link>
          <Link to="/categories">Categories</Link>
          <Link to="/shoppingcartpage" className="cart-link">
            Cart
            <span className="cart-badge">
              {isLoadingCart ? "..." : cartCount}
            </span>
          </Link>
        </nav>

        <div className="nav-auth">
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="profile-link">
                <span className="profile-badge">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </span>
                {user?.name?.split(" ")[0] || user?.username || "Profile"}
              </Link>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign Up</Link>
            </>
          )}
        </div>

        <button
          className="mobile-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          ☰
        </button>
      </div>

      {isMenuOpen && (
        <div className="mobile-menu">
          <Link to="/">Home</Link>
          <Link to="/allstorespage">Shops</Link>
          <Link to="/productlistingpage">Products</Link>
          <Link to="/categories">Categories</Link>
          <Link to="/shoppingcartpage">
            Cart {cartCount > 0 && `(${cartCount})`}
          </Link>
          {isLoggedIn ? (
            <>
              <Link to="/dashboard">Profile</Link>
              <button onClick={handleLogout}>Logout</button>
            </>
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
