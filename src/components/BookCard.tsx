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

interface BookCardProps {
  book: Book;
  onPurchase: () => void;
  onRemove?: () => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onPurchase, onRemove }) => {
  const bookMedia = book.image.endsWith('.mp4') ? (
    <video className="video" autoPlay muted loop>
      <source src={book.image} type="video/mp4" />
      Your browser does not support video.
    </video>
  ) : (
    <img src={book.image} alt={book.title} className="image" />
  );

  return (
    <div className="card">
      {bookMedia}
      <h3>{book.title}</h3>
      <p className="author">{book.author}</p>
      <p className="price">{book.price.toFixed(2)} €</p>
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
