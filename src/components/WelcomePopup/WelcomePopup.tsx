import React from 'react';
import styles from './WelcomePopup.module.css';

interface WelcomePopupProps {
  onDeny: () => void;
  onConfirm: () => void;
}

const WelcomePopup: React.FC<WelcomePopupProps> = ({ onDeny, onConfirm }) => {
  return (
    <div className={styles.popup} style={{ display: 'flex' }}>
      <div className={styles.popupContent}>
        <h1 className={styles.popupTitle}>KNIGBOOM</h1>
        <p className={styles.popupTagline}>THE CORNER STORE</p>
        <p className={styles.popupText}>Book and cup of coffee is always a great combo, right?</p>
        <div className={styles.popupContainer}>
          <button className={styles.denyPopup} onClick={onDeny}>Tea, please!</button>
          <button className={styles.confirmPopup} onClick={onConfirm}>I agree</button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePopup;
