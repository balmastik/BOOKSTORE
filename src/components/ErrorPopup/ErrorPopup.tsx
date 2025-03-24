import React from 'react';
import styles from './ErrorPopup.module.css';

interface ErrorPopupProps {
  message: string;
  onClose: () => void;
}

const ErrorPopup: React.FC<ErrorPopupProps> = ({message, onClose}) => {
  return (
    <div className={`${styles.popup} ${message ? styles.show : ''}`}>
      <div className={styles.popupContent}>
        <p className={styles.popupText}>{message}</p>
        <div className={styles.popupContainer}>
          <button className={styles.closePopup} onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPopup;
