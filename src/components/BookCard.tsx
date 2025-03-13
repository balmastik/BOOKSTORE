import React from 'react';

interface Book {
  title: string;
  author: string;
  genre: string;
  year: number;
  image: string;
  price: number;
  quantity: number;
}

interface StoreBook {
  book: Book;
}

interface BookCardProps {
  storeBook: StoreBook;
  onPurchase: () => void;
  onRemove?: () => void;
}

const BookCard: React.FC<BookCardProps> = ({ storeBook, onPurchase, onRemove }) => {
  const bookMedia = storeBook.book.image.endsWith('.mp4') ? (
    <video className="video" autoPlay muted loop>
      <source src={storeBook.book.image} type="video/mp4" />
      Your browser does not support video.
    </video>
  ) : (
    <img src={storeBook.book.image} alt={storeBook.book.title} className="image" />
  );

  return (
    <div className="card">
      {bookMedia}
      <h3>{storeBook.book.title}</h3>
      <p className="author">{storeBook.book.author}</p>
      <p className="price">{storeBook.book.price.toFixed(2)} €</p>
      <div>
        <button className="book-button" onClick={onPurchase}>
          Purchase
        </button>
        {onRemove && (
          <button className="book-button" onClick={onRemove}>
            Remove
          </button>
        )}
      </div>
    </div>
  );
};

export default BookCard;
