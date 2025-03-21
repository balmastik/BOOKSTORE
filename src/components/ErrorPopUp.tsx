import React from 'react';

interface ErrorProps {
  message: string;
  onClose: () => void;
}

const ErrorModal: React.FC<ErrorProps> = ({ message, onclose }) => {
  return (
    <div className="popup" style={{ display: message ? 'flex' : 'none' }}>
      <div className="popup-content">

        <h1 className="header-title">KNIGBOOM</h1>
        <p className="header-tagline">THE CORNER STORE</p>
        <p className="popup-text">{message}</p>
        <div className="popup-container">
          <button className="confirm-popup" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPopUp;
