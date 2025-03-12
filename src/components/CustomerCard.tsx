import React from 'react';

interface Customer {
  name: string;
  balance: number;
  image: string;
}

interface CustomerCardProps {
  customer: Customer;
  onIncreaseBalance: () => void;
}

const CustomerCard: React.FC<CustomerCardProps> = ({ customer, onIncreaseBalance }) => {
  const customerImage = customer.image ? (
    <img src={customer.image} alt={customer.name} className="image" />
  ) : (
    <div className="image-placeholder"></div>
  );

  return (
    <div className="card">
      {customerImage}
      <h3>{customer.name}</h3>
      <p className="balance">{customer.balance.toFixed(2)} €</p>
      <button className="customer-button" onClick={onIncreaseBalance}>
        Increase balance
      </button>
    </div>
  );
};

export default CustomerCard;
