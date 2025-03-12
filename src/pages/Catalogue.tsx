import React, { useEffect, useState } from 'react';
import BookCard from './components/BookCard';

interface Book {
  title: string;
  author: string;
  genre: string;
  year: number;
  image: string;
  price: number;
  quantity: number;
}

const Catalogue: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [yearRange, setYearRange] = useState([1800, 2025]);

  useEffect(() => {
    // Загружаем все книги
    fetch('http://localhost:3000/api/books')
      .then((res) => res.json())
      .then((data) => {
        setBooks(data);
        setFilteredBooks(data); // Изначально показываем все книги
      })
      .catch((error) => console.error('Books loading error:', error));
  }, []);

  // Поиск книг
  const handleSearch = () => {
    const query = searchTerm.toLowerCase().trim();
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
    <div>
      <h2>Catalogue</h2>

      {/* Поиск */}
      <div>
        <input
          type="text"
          placeholder="Search by title, author, genre"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* Фильтры */}
      <section>
        <div>
          <label>Price Range</label>
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

      {/* Список книг */}
      <div id="book-list">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <BookCard key={book.title} book={book} onPurchase={() => alert(`Purchase ${book.title}`)} />
          ))
        ) : (
          <p>No books found</p>
        )}
      </div>
    </div>
  );
};

export default Catalogue;
