import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import styles from './Footer.module.css';

interface FooterProps {
  onSubscribe: (email: string) => void;
  message: string;
}

const Footer: React.FC<FooterProps> = ({onSubscribe, message}) => {
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const emailRegexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const trimmedEmail = subscribeEmail.trim().toLowerCase();
    if (!trimmedEmail || !emailRegexp.test(trimmedEmail)) {
      setErrorMessage('Please enter a valid email');
      setTimeout(() => setErrorMessage(''), 2000);
      return;
    }

    onSubscribe(trimmedEmail);
    setSubscribeEmail('');
  };

  return (
    <footer className={styles.footer}>

      <h1 className={styles.footerTitle}>KNIGBOOM</h1>
      <p className={styles.footerTagline}>THE CORNER STORE</p>

      <div className={styles.newsletter}>
        <h2 className={styles.newsletterTitle}>NEWSLETTER</h2>
        <p className={styles.newsletterText}>
          Get information about discounts, new arrivals, and exclusive offers directly to your email.
        </p>

        <form className={styles.newsletterForm} onSubmit={handleSubmit} noValidate>
          <input
            className={styles.newsletterInput}
            type="email"
            placeholder="Enter your email"
            value={subscribeEmail}
            onChange={(e) => setSubscribeEmail(e.target.value)}
          />
          <button type="submit" className={styles.newsletterButton}>Subscribe</button>
          <div className={styles.messageWrapper}>
            {(message || errorMessage) && (
              <p className={styles.newsletterMessage}>
                {errorMessage || message}
              </p>
            )}
          </div>
        </form>
      </div>
      <nav>
        <ul className={styles.navList}>
          <li><Link to="/" className={styles.navListLink}>PAYMENT</Link></li>
          <li><Link to="/" className={styles.navListLink}>DELIVERY</Link></li>
          <li><Link to="/" className={styles.navListLink}>TERMS</Link></li>
        </ul>
      </nav>

      <p className={styles.siteFinish}>© 2025 KNIGBOOM BookStore</p>
    </footer>
  );
};

export default Footer;
