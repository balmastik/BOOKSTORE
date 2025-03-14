import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = ()=> {
  return (
    <header className="header">
      <div className="container">
        <div className="branding">
          <Link to="/" className="header-title">KNIGBOOM</Link>
          <p className="header-tagline">THE CORNER STORE</p>
        </div>
        <nav className="navigation">
          <ul className="nav-list">
            <li><Link to="/" className="nav-list-link">Catalogue</Link></li>
            <li><Link to="/customer" className="nav-list-link">Customer</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
