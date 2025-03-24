import React from 'react';
import {Customer} from '../../interfaces/entities';
import styles from './CustomerCard.module.css';

interface CustomerCardProps {
  customer: Customer;
  onIncreaseBalance: () => void;
}

const CustomerCard: React.FC<CustomerCardProps> = ({customer, onIncreaseBalance}) => {
  const customerImage = customer.image ? (
    <img src={customer.image} alt={customer.name} className={styles.image}/>
  ) : (
    <div className={styles.imagePlaceholder}></div>
  );

  return (
    <div className={styles.card}>
      {customerImage}
      <h3>{customer.name}</h3>
      <p className={styles.balance}>{customer.balance.toFixed(2)} €</p>
      <button className={styles.customerButton} onClick={onIncreaseBalance}>
        Increase balance
      </button>
    </div>
  );
};

export default CustomerCard;
