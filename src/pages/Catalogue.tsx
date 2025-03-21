import React, {useState, useEffect} from 'react';

import {StoreBook} from '../interfaces/Entities';
import {fetchDisplay} from '../components/catalogueServices/FetchDisplay';
import {fetchSale} from '../components/catalogueServices/FetchSale';
import {fetchSearch} from '../components/catalogueServices/FetchSearch';

import BookCard from '../components/BookCard';
import Search from '../components/Search';
import Filter from '../components/Filter';
import ErrorPopUp from '../components/ErrorPopUp';

import {useReloadLibrary} from '../context/ReloadLibraryContext';
import {generatePDF} from '../utils/generatePDF';

const Catalogue: React.FC<CatalogueProps> = () => {
  const [popupShown, setPopupShown] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [books, setBooks] = useState<StoreBook[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<StoreBook[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const {setReloadLibrary} = useReloadLibrary();

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
    fetchDisplay.display()
      .then((data) => {
        setBooks(data);
        setFilteredBooks(data);
        setMessage(null);
      })
      .catch((error) => setMessage(error.message));
  }, []);

  const handleSale = (storeBook: StoreBook) => {
    fetchSale.sale(storeBook)
      .then((data) => {
        setBooks(data);
        setFilteredBooks(data);
        setReloadLibrary(prev => !prev);
        setMessage(null);
      });
      .catch((error) => setMessage(error.message));
  }

  const handleSearch = (query: string) => {
    fetchSearch.search(query)
      .then(data => {
        setFilteredBooks(data);
        setMessage(null);
      });
    .catch((error) => setMessage(error.message));
  }

  const handleClearSearch = () => {
    setFilteredBooks(books);
  };

  const handleApplyFilter = (priceMin: number, priceMax: number, yearMin: number, yearMax: number) => {
    fetch('http://localhost:3000/api/books/filter', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({priceMin, priceMax, yearMin, yearMax})
    })
      .then((res) => res.json())
      .then((foundBooks) => setFilteredBooks(foundBooks))
      .catch((error) => console.error("Error applying filters:", error));
  }

  const handleClearFilter = () => {
    setFilteredBooks(books);
  }

  const handleOpenFilter = () => {
    setIsFilterOpen(true);
  };

  const handleCloseFilter = () => {
    setIsFilterOpen(false);
  };

  const downloadCatalogue = () => {
    const pdfContent = books
      .map((item: StoreBook) => {
        return `Book: "${item.book.title}". Author: ${item.book.author}.\n` +
          `Genre: ${item.book.genre}. Publication year: ${item.book.year}.\n` +
          `Price: ${item.book.price.toFixed(2)} EUR. In stock: ${item.book.quantity}.`
      })
      .join('\n\n');

    generatePDF('KNIGBOOM Catalogue', pdfContent);
  }

  return (
    <>
      <section className="page-header">
        <h2 className="page-header-title">Catalogue</h2>
        <Search
          onSearch={handleSearch}
          onClearSearch={handleClearSearch}
          onOpenFilter={handleOpenFilter}
        />
      </section>

      <section className="filter-section">
        <Filter
          isOpen={isFilterOpen}
          onCloseFilter={handleCloseFilter}
          onApplyFilter={handleApplyFilter}
          onClearFilter={handleClearFilter}
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

      <ErrorPopUp message={message} onClose={() => setMessage(null)} />

      {popupShown && (
        <div className="popup" style={{ display: 'flex' }}>
          <div className="popup-content">

            <h1 className="header-title">KNIGBOOM</h1>
            <p className="header-tagline">THE CORNER STORE</p>
            <p className="popup-text">Book and cup of coffee is always a great combo, right?</p>
            <div className="popup-container">
              <button className="deny-popup" onClick={hidePopup}>A cup of tea, please</button>
              <button className="confirm-popup" onClick={hidePopup}>I agree</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Catalogue;



