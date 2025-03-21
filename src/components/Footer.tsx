import React, {useState} from 'react';
import {Link} from 'react-router-dom';

interface FooterProps {
  onSubscribe: (email: string) => void;
  message: string;
}

const Footer: React.FC<FooterProps> = ({ onSubscribe, message }) => {
  const [subscribeEmail, setSubscribeEmail] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const emailRegexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const trimmedEmail = subscribeEmail.trim().toLowerCase();
    if (!trimmedEmail || !emailRegexp.test(trimmedEmail)) {
      alert('Please enter a valid email');
      return;
    }

    onSubscribe(trimmedEmail);
    setSubscribeEmail('');
  };

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

          <form onSubmit={handleSubmit} className="newsletter-form-container" noValidate>
            <input
              type="email"
              placeholder="Enter your email"
              value={subscribeEmail}
              onChange={(e) => setSubscribeEmail(e.target.value)}
            />
            <button type="submit" className="newsletter-button">Subscribe</button>
          </form>

          {message && <p className="newsletter-message">{message}</p>}
        </div>

        <nav className="navigation">
          <ul className="nav-list">
            <li><Link to="/" className="nav-list-link">PAYMENT</Link>
            </li>
            <li><Link to="/" className="nav-list-link">DELIVERY</Link>
            </li>
            <li><Link to="/" className="nav-list-link">TERMS</Link>
            </li>
          </ul>
        </nav>

        <p className="site-finish">© 2025 KNIGBOOM BookStore</p>
      </div>
    </footer>
  );
};

export default Footer;
