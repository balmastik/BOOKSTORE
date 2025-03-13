import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="branding">
          <h1 className="footer-title">KNIGBOOM</h1>
          <p className="footer-tagline">THE CORNER STORE</p>
        </div>
        <div className="newsletter">
          <h2 className="newsletter-title">NEWSLETTER</h2>
          <p className="newsletter-text">
            Get information about discounts, new arrivals, and exclusive offers directly to your email.
          </p>
          <form action="#" method="post" id="newsletter-form" className="newsletter-form-container">
            <input
              type="email"
              name="email"
              id="newsletter-email"
              placeholder="Enter your email"
              required
            />
            <button type="submit" className="newsletter-button">Subscribe</button>
          </form>
          <p id="newsletter-message" className="newsletter-message" style={{ display: 'none' }}></p>
        </div>
        <nav className="navigation">
          <ul className="nav-list">
            <li><Link to="/payment" className="nav-list-link">PAYMENT</Link>
            </li>
            <li><Link to="/delivery" className="nav-list-link">DELIVERY</Link>
            </li>
            <li><Link to="/terms" className="nav-list-link">TERMS</Link>
            </li>
          </ul>
        </nav>
        <p className="site-finish">© 2025 KNIGBOOM BookStore</p>
      </div>
    </footer>
  );
};

export default Footer;
