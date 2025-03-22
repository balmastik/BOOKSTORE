import React, { useState, useEffect } from 'react';

import { StoreBook } from '../interfaces/entities';
import { catalogueServices } from '../services/catalogueServices';

import BookCard from '../components/BookCard';
import Search from '../components/Search';
import Filter from '../components/Filter';
import WelcomePopup from '../components/WelcomePopup';
import ErrorPopup from '../components/ErrorPopup';
import { useReloadLibrary } from '../context/ReloadLibraryContext';
import {generatePdf} from '../utils/generatePdf';

const CataloguePage: React.FC = () => {
  const [popupShown, setPopupShown] = useState<boolean>(false);
  const [books, setBooks] = useState<StoreBook[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<StoreBook[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const { setReloadLibrary } = useReloadLibrary();

  useEffect(() => {
    const popupStatus = localStorage.getItem('popupShown');
    if (!popupStatus) {
      setPopupShown(true);
    }
  }, []);

  const hidePopup = () => {
    setPopupShown(false);
    localStorage.setItem('popupShown', 'true');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await catalogueServices.display();
        setBooks(data);
        setFilteredBooks(data);
        setMessage('');
      } catch (error) {
        setMessage(error as string);
      }
    };
    fetchData();
  }, []);

  const handleSale = async (storeBook: StoreBook) => {
    try {
      const data = await catalogueServices.sale(storeBook);
      setBooks(data);
      setFilteredBooks(data);
      setReloadLibrary((prev) => !prev);
      setMessage('');
    } catch (error) {
      setMessage(error as string);
    }
  };

  const handleSearch = async (query: string) => {
    try {
      const data = await catalogueServices.search(query);
      setFilteredBooks(data);
      setMessage('');
    } catch (error) {
      setMessage(error as string);
    }
  };

  const clearSearch = () => setFilteredBooks(books);

  const handleFilter = async (
    priceMin: number,
    priceMax: number,
    yearMin: number,
    yearMax: number
  ) => {
    try {
      const data = await catalogueServices.filter(priceMin, priceMax, yearMin, yearMax);
      setFilteredBooks(data);
      setMessage('');
    } catch (error) {
      setMessage(error as string);
    }
  };

  const clearFilter = () => setFilteredBooks(books);

  const openFilter = () => setIsFilterOpen(true);
  const closeFilter = () => setIsFilterOpen(false);

  const downloadCatalogue = () => {
    const pdfContent = books
      .map((item: StoreBook) => {
        return `Book: "${item.book.title}". Author: ${item.book.author}.\n` +
          `Genre: ${item.book.genre}. Publication year: ${item.book.year}.\n` +
          `Price: ${item.book.price.toFixed(2)} EUR. In stock: ${item.book.quantity}.`
      })
      .join('\n\n');

    generatePdf('KNIGBOOM Catalogue', pdfContent);
  };

  return (
    <>
      <section className="page-header">
        <h2 className="page-header-title">Catalogue</h2>
        <Search
          onSearch={handleSearch}
          onClearSearch={clearSearch}
          onOpenFilter={openFilter}
        />
      </section>

      <section className="filter-section">
        <Filter
          isOpen={isFilterOpen}
          onCloseFilter={closeFilter}
          onApplyFilter={handleFilter}
          onClearFilter={clearFilter}
        />
      </section>

      <section className="book-list">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((storeBook) => (
            <BookCard
              key={storeBook.book.title}
              storeBook={storeBook}
              onSale={() => handleSale(storeBook)}
            />
          ))
        ) : (
          <p className="inform-message">No books found</p>
        )}
      </section>

      <section className="download-catalogue">
        <button onClick={downloadCatalogue} className="catalogueButton">
          Download Catalogue
        </button>
      </section>

      <ErrorPopup message={message} onClose={() => setMessage('')} />
      {popupShown && (<WelcomePopup onDeny={hidePopup} onConfirm={hidePopup} />)}
    </>
  );
};

export default CataloguePage;
