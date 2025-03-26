import React from 'react';
import styles from './ErrorPopup.module.css';

interface ErrorPopupProps {
  message: string;
  onClose: () => void;
}

const ErrorPopup: React.FC<ErrorPopupProps> = ({message, onClose}) => {
  return (
    <div className={`${styles.errorPopup} ${message ? styles.show : ''}`}>
      <div className={styles.errorPopupContent}>
        <p className={styles.errorPopupText}>{message}</p>
        <div className={styles.errorPopupContainer}>
          <button className={styles.errorClosePopup} onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPopup;
