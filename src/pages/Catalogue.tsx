import React, {useEffect, useState} from 'react';
import BookCard from '../components/BookCard';
import Search from '../components/Search';
import Filter from '../components/Filter';

interface BookData {
  title: string;
  author: string;
  genre: string;
  year: number;
  image: string;
  price: number;
  quantity: number;
}

interface StoreBook {
  book: BookData;
}

const Catalogue: React.FC = () => {
  const [books, setBooks] = useState<StoreBook[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<StoreBook[]>([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/books')
      .then((res) => res.json())
      .then((data) => {
        setBooks(data);
        setFilteredBooks(data);
      })
      .catch((error) => console.error('Error loading books:', error));
  }, []);

  const handleSearch = (query: string) => {
    fetch('http://localhost:3000/api/books/search', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({query}),
    })
      .then((res) => res.json())
      .then((foundBooks) => {
        setFilteredBooks(foundBooks);
      })
      .catch((error) => console.error('Error searching books:', error));
  };

  const handleApplyFilter = (priceMin: number, priceMax: number, yearMin: number, yearMax: number) => {
    fetch('http://localhost:3000/api/books/filter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceMin, priceMax, yearMin, yearMax })
    })
      .then((res) => res.json())
      .then((data) => setFilteredBooks(data))
      .catch((error) => console.error("Error applying filters:", error));
  };

  const handleClearFilter = () => {
    setFilteredBooks(books);
  };

  return (
    <div>
      <section className="page-header">
        <h2 className="page-header-title">Catalogue</h2>
        <Search onSearch={handleSearch}/>
        <img src="./dist/icon/filter_book_icon.svg" alt="Open filter" className="open-filter-img" />
      </section>

      <section className="filter-section">
        <Filter onApplyFilter={handleApplyFilter} onClearFilter={handleClearFilter}/>
      </section>

      <section className="book-list">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((storeBook) => (
            <BookCard
              key={storeBook.book.title}
              storeBook={storeBook}
              onPurchase={() => alert(`Purchase ${storeBook.book.title}`)}
            />
          ))
        ) : (
          <p>No books found</p>
        )}
      </section>
    </div>
);
};

export default Catalogue;
