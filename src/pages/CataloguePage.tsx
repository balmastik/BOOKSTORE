import React, {useState, useEffect} from 'react';
import styles from './CataloguePage.module.css';
import {useDispatch, useSelector} from 'react-redux';
import {RootState, AppDispatch} from '../redux/store';
import {loadBooks, searchBooks, filterBooks, saleBook, setMessage, clearSearch} from '../redux/catalogueSlice';
import {StoreBook} from '../catalogue/catalogueInterface';
import BookCard from '../components/BookCard/BookCard';
import Search from '../components/Search/Search';
import Filter from '../components/Filter/Filter';
import DownloadPdf from '../components/DownloadPdf/DownloadPdf';
import WelcomePopup from '../components/WelcomePopup/WelcomePopup';
import ErrorPopup from '../components/ErrorPopup/ErrorPopup';
import {useReloadLibrary} from '../context/ReloadLibraryContext';

const CataloguePage: React.FC = () => {
  const [popupShown, setPopupShown] = useState<boolean>(false);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const {books, filteredBooks, message} = useSelector((state: RootState) => state.catalogue);
  const {setReloadLibrary} = useReloadLibrary();

  useEffect(() => {
    const popupStatus = localStorage.getItem('popupShown');
    if (!popupStatus) {
      setPopupShown(true);
    }
  }, []);

  useEffect(() => {
    const loadBooksWithDelay = async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      dispatch(loadBooks());
    };
    loadBooksWithDelay();
  }, [dispatch]);

  const hidePopup = () => {
    setPopupShown(false);
    localStorage.setItem('popupShown', 'true');
  };

  const handleSearch = (query: string) => {
    dispatch(searchBooks(query));
  };

  const handleFilter = (priceMin: number, priceMax: number, yearMin: number, yearMax: number) => {
    dispatch(filterBooks({priceMin, priceMax, yearMin, yearMax}));
  };

  const handleClear = () => {
    dispatch(clearSearch());
  };

  const handleSale = (storeBook: StoreBook) => {
    dispatch(saleBook(storeBook));
    setReloadLibrary((prev) => !prev);
  };

  const downloadCatalogue = () => {
    return books
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
        <Search
          onSearch={handleSearch}
          onClearSearch={handleClear}
          onOpenFilter={() => setIsFilterOpen(true)}
        />
      </section>

      <Filter
        isOpen={isFilterOpen}
        onCloseFilter={() => setIsFilterOpen(false)}
        onApplyFilter={handleFilter}
        onClearFilter={handleClear}
      />

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
      <ErrorPopup message={message} onClose={() => dispatch(setMessage(''))}/>
      {popupShown && (<WelcomePopup onDeny={hidePopup} onConfirm={hidePopup}/>)}
    </>
  );
};

export default CataloguePage;
