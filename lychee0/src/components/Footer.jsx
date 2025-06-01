import React from "react";
import { Link } from "react-router-dom";
import "../ComponentsCss/Footer.css";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-section brand-section">
          <h3 className="footer-heading">Lychee</h3>
          <p className="footer-tagline">
            Enhancing Beauty, Elevating Confidence.
          </p>
          <div className="social-links">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link facebook"
              aria-label="Facebook"
            >
              f
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link instagram"
              aria-label="Instagram"
            >
              IG
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link twitter"
              aria-label="Twitter"
            >
              X
            </a>
            <a
              href="https://pinterest.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link pinterest"
              aria-label="Pinterest"
            >
              P
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Shop</h4>
          <ul className="footer-links">
            <li>
              <Link to="/allstorespage">All Shops</Link>
            </li>
            <li>
              <Link to="/productlistingpage">All Products</Link>
            </li>
            <li>
              <Link to="/">Featured Products</Link>
            </li>
            <li>
              <Link to="/">Sales & Discounts</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Help</h4>
          <ul className="footer-links">
            <li>
              <Link to="/faq">FAQ</Link>
            </li>
            <li>
              <Link to="/faq">Shipping Information</Link>
            </li>
            <li>
              <Link to="/faq">Returns & Exchanges</Link>
            </li>
            <li>
              <Link to="/contact">Contact Us</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">About</h4>
          <ul className="footer-links">
            <li>
              <Link to="/blogAndBeauty">Blogs</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p className="copyright">
            © {new Date().getFullYear()} Lychee. All rights reserved.
          </p>
          <div className="policy-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/accessibility">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
