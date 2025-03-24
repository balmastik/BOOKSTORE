import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';

const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.headerTitle} onClick={handleHomeClick}>KNIGBOOM</Link>
      <p className={styles.headerTagline}>THE CORNER STORE</p>

      <nav>
        <ul className={styles.navList}>
          <li><Link to="/" className={styles.navListLink}>Catalogue</Link></li>
          <li><Link to="/customer" className={styles.navListLink}>Customer</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;

