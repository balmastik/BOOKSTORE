import React from 'react';
import {StoreBook} from '../../interfaces/entities';
import styles from './BookCard.module.css';

interface BookCardProps {
  storeBook: StoreBook;
  onSale?: () => void;
  onRemove?: () => void;
}

const BookCard: React.FC<BookCardProps> = ({storeBook, onSale, onRemove}) => {
  const bookMedia = storeBook.book.image.endsWith('.mp4') ? (
    <video className={styles.video} autoPlay muted loop>
      <source src={storeBook.book.image} type="video/mp4"/>
      Your browser does not support video.
    </video>
  ) : (
    <img src={storeBook.book.image} alt={storeBook.book.title} className={styles.image}/>
  );

  return (
    <div className={styles.card}>
      {bookMedia}
      <h3 className={styles.title} >{storeBook.book.title}</h3>
      <p className={`${styles.author} ${onRemove ? styles.bottom : ''}`}>{storeBook.book.author}</p>
      {onSale && <p className={styles.price}>{storeBook.book.price.toFixed(2)} €</p>}
      {onSale && <button className={styles.bookButton} onClick={onSale}>Purchase</button>}
      {onRemove && <button className={styles.bookButton} onClick={onRemove}>Remove</button>}
    </div>
  );
};

export default BookCard;
