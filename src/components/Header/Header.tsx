import React from 'react';
import {Link} from 'react-router-dom';
import styles from './Header.module.css';

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <Link to="/" className={styles.headerTitle}>KNIGBOOM</Link>
      <p className={styles.headerTagline}>THE CORNER STORE</p>

      <nav>
        <ul className={styles.headerNav}>
          <li><Link to="/" className={styles.headerNavLink}>Catalogue</Link></li>
          <li><Link to="/customer" className={styles.headerNavLink}>Customer</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;

