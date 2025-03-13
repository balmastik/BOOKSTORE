import React, { useEffect, useState } from 'react';
import BookCard from '../components/BookCard';
import Search from '../components/Search';

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

const Catalogue: React.FC = () => {
  const [books, setBooks] = useState<StoreBook[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<StoreBook[]>([]);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [yearRange, setYearRange] = useState([1800, 2025]);

  useEffect(() => {
    fetch('http://localhost:3000/api/books')
      .then((res) => res.json())
      .then((data) => {
        setBooks(data);
        setFilteredBooks(data);
      })
      .catch((error) => console.error('Books loading error:', error));
  }, []);

  const handleSearch = (query: string) => {
    fetch('http://localhost:3000/api/books/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    })
      .then((res) => res.json())
      .then((foundBooks) => {
        setFilteredBooks(foundBooks);
      })
      .catch((error) => console.error('Searching books loading error:', error));
  };

  // Применение фильтров по цене и году
  const applyFilter = () => {
    fetch('http://localhost:3000/api/books/filter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceRange, yearRange }),
    })
      .then((res) => res.json())
      .then((filteredBooks) => {
        setFilteredBooks(filteredBooks);
      })
      .catch((error) => console.error('Filtering books loading error:', error));
  };

  // Обработчик изменения диапазона цен
  const handlePriceChange = (min: number, max: number) => {
    setPriceRange([min, max]);
  };

  // Обработчик изменения диапазона годов
  const handleYearChange = (min: number, max: number) => {
    setYearRange([min, max]);
  };

  return (
    <section className="page-header">
      <h2 className="page-header-title">Catalogue</h2>
        <Search onSearch={handleSearch} />
    </section>

    <section className="filter-section">
      <div id="filter-panel" className="filter-panel">
        <button id="close-filter" className="filter-panel-close">X</button>
        <div className="filter-content">
          <h2>Filter</h2>
          <div className="range">
            <label htmlFor="price-range-container" className="range-label">PRICE RANGE</label>
            <div class="range-values">
              <input
                type="range"
                min="0"
                max="100"
              value={priceRange[0]}
              onChange={(e) => handlePriceChange(parseFloat(e.target.value), priceRange[1])}
            />
            <input
              type="range"
              min="0"
              max="100"
              value={priceRange[1]}
              onChange={(e) => handlePriceChange(priceRange[0], parseFloat(e.target.value))}
            />
            <p>{priceRange[0]} € - {priceRange[1]} €</p>
          </div>

          <div>
            <label>Year Range</label>
            <input
              type="range"
              min="1800"
              max="2025"
              value={yearRange[0]}
              onChange={(e) => handleYearChange(parseFloat(e.target.value), yearRange[1])}
            />
            <input
              type="range"
              min="1800"
              max="2025"
              value={yearRange[1]}
              onChange={(e) => handleYearChange(yearRange[0], parseFloat(e.target.value))}
            />
            <p>{yearRange[0]} - {yearRange[1]}</p>
          </div>

          <button onClick={applyFilter}>Apply Filters</button>
    </section>

  <div id="book-list">
    {filteredBooks.length > 0 ? (
          filteredBooks.map((storeBook) => (
            <BookCard key={storeBook.book.title} book={storeBook} onPurchase={() => alert(`Purchase ${storeBook.book.title}`)}/>
          ))
        ) : (
          <p>No books found</p>
        )}
      </div>
    </div>
  );
};

export default Catalogue;
