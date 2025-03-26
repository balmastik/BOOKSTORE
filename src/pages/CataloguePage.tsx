import React, {useState, useEffect} from 'react';
import styles from './CataloguePage.module.css';
import {StoreBook} from '../interfaces/entities';
import {catalogueServices} from '../services/catalogueServices';
import BookCard from '../components/BookCard/BookCard';
import Search from '../components/Search/Search';
import Filter from '../components/Filter/Filter';
import DownloadPdf from '../components/DownloadPdf/DownloadPdf';
import WelcomePopup from '../components/WelcomePopup/WelcomePopup';
import ErrorPopup from '../components/ErrorPopup/ErrorPopup';
import {useReloadLibrary} from '../context/ReloadLibraryContext';


const CataloguePage: React.FC = () => {
  const [popupShown, setPopupShown] = useState<boolean>(false);
  const [books, setBooks] = useState<StoreBook[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<StoreBook[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const {setReloadLibrary} = useReloadLibrary();

  useEffect(() => {
    const popupStatus = localStorage.getItem('popupShown');
    if (!popupStatus) {
      setPopupShown(true);
    }

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

  const hidePopup = () => {
    setPopupShown(false);
    localStorage.setItem('popupShown', 'true');
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

  const downloadCatalogue = () => {
    return  books
      .map((item: StoreBook) => {
        return `Book: "${item.book.title}". Author: ${item.book.author}.\n` +
          `Genre: ${item.book.genre}. Publication year: ${item.book.year}.\n` +
          `Price: ${item.book.price.toFixed(2)} EUR. In stock: ${item.book.quantity}.`
      })
      .join('\n\n');
  };

  return (
    <>
      <section className={styles.catalogueHeader}>
        <h2 className={styles.catalogueTitle}>Catalogue</h2>
        <Search onSearch={handleSearch} onClearSearch={clearSearch} onOpenFilter={openFilter}/>
      </section>

      <Filter isOpen={isFilterOpen} onCloseFilter={closeFilter} onApplyFilter={handleFilter} onClearFilter={clearFilter}/>

      <section className={styles.catalogue}>
        {filteredBooks.length > 0 ? (
          filteredBooks.map((storeBook) => (
            <BookCard
              key={storeBook.book.title}
              storeBook={storeBook}
              onSale={() => handleSale(storeBook)}
            />
          ))
        ) : (
          <p className={styles.catalogueMessage}>No books found</p>
        )}
      </section>

      <DownloadPdf title="KNIGBOOM Catalogue" pdfContent={downloadCatalogue()}/>
      <ErrorPopup message={message} onClose={() => setMessage('')}/>
      {popupShown && (<WelcomePopup onDeny={hidePopup} onConfirm={hidePopup}/>)}
    </>
  );
};

export default CataloguePage;
