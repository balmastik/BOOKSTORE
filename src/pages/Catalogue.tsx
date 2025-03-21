import React, {useState, useEffect} from 'react';

import {StoreBook} from '../interfaces/entities';
import {fetchDisplay} from '../catalogueServices/fetchDisplay';
import {fetchSale} from '../catalogueServices/fetchSale';
import {fetchSearch} from '../catalogueServices/fetchSearch';
import {fetchFilter} from '../catalogueServices/fetchFilter';

import BookCard from '../components/BookCard';
import Search from '../components/Search';
import Filter from '../components/Filter';
import WelcomePopUp from '../components/WelcomePopUp';
import ErrorPopUp from '../components/ErrorPopUp';

import {useReloadLibrary} from '../context/ReloadLibraryContext';
import {generatePDF} from '../utils/generatePDF';

const Catalogue: React.FC<CatalogueProps> = () => {
  const [popupShown, setPopupShown] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [books, setBooks] = useState<StoreBook[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<StoreBook[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
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
      })
      .catch((error) => setMessage(error.message));
  };

  const handleSearch = (query: string) => {
    fetchSearch.search(query)
      .then((data) => {
        setFilteredBooks(data);
        setMessage(null);
      })
    .catch((error) => setMessage(error.message));
  };

  const clearSearch = () => setFilteredBooks(books);

  const handleFilter = (priceMin: number, priceMax: number, yearMin: number, yearMax: number) => {
    fetchFilter.filter(priceMin, priceMax, yearMin, yearMax)
      .then((data) => {
        setFilteredBooks(data);
        setMessage(null);
      })
      .catch((error) => setMessage(error.message));
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

    generatePDF('KNIGBOOM Catalogue', pdfContent);
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

      <ErrorPopUp message={message} onClose={() => setMessage(null)} />
      {popupShown && (<WelcomePopup onDeny={hidePopup} onConfirm={hidePopup} />)}
    </>
  );
};

export default Catalogue;



