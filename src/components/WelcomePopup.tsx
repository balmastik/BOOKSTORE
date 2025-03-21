import React from 'react';

interface WelcomePopupProps {
  onDeny: () => void;
  onConfirm: () => void;
}

const WelcomePopup: React.FC<WelcomePopupProps> = ({ onDeny, onConfirm }) => {
  return (
    <div className="popup" style={{ display: 'flex' }}>
      <div className="popup-content">
        <h1 className="header-title">KNIGBOOM</h1>
        <p className="header-tagline">THE CORNER STORE</p>
        <p className="popup-text">Book and cup of coffee is always a great combo, right?</p>
        <div className="popup-container">
          <button className="deny-popup" onClick={onDeny}>A cup of tea, please</button>
          <button className="confirm-popup" onClick={onConfirm}>I agree</button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePopup;
