import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate("/");
  };

  return (
    <header className="header">
      <div className="container">

        <div className="branding">
          <Link to="/" className="header-title" onClick={handleHomeClick}>KNIGBOOM</Link>
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
