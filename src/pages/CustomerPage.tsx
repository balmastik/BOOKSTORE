import React, {useEffect} from 'react';
import styles from './CustomerPage.module.css';
import {useDispatch, useSelector} from 'react-redux';
import {RootState, AppDispatch} from '../redux/store';
import {loadCustomer, increaseBalance, loadLibrary, searchBooks, addBook, removeBook, setMessage, clearSearch} from '../redux/customerSlice';
import {StoreBook} from '../interfaces/entities';
import CustomerCard from '../components/CustomerCard/CustomerCard';
import BookCard from '../components/BookCard/BookCard';
import Search from '../components/Search/Search';
import AddBook from '../components/AddBook/AddBook';
import ErrorPopup from '../components/ErrorPopup/ErrorPopup';
import {useReloadLibrary} from '../context/ReloadLibraryContext';

const CustomerPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {customer, filteredBooks, message} = useSelector((state: RootState) => state.customer);
  const {reloadLibrary} = useReloadLibrary();

  useEffect(() => {
    dispatch(loadCustomer());
  }, [dispatch]);

  const handleIncreaseBalance = async () => {
    const amount: number = parseFloat(prompt('Please enter the amount, 0') || '0');
    if (isNaN(amount) || amount <= 0) {
      dispatch(setMessage('Please enter a valid positive number'));
      return;
    }

    dispatch(increaseBalance(amount));
  };

  useEffect(() => {
    dispatch(loadLibrary());
  }, [dispatch, reloadLibrary]);

  const handleRemove = (storeBook: StoreBook) => {
    dispatch(removeBook(storeBook));
  };

  const handleSearch = (query: string) => {
    dispatch(searchBooks(query));
  };

  const handleClear = () => {
    dispatch(clearSearch());
  };

  const handleAddBook = (title: string, author: string, image: File) => {
    dispatch(addBook({ title, author, image }));
  };

  return (
    <>
      <section className={styles.customerHeader}>
        <h2 className={styles.customerTitle}>Customer</h2>
      </section>

      <section className={styles.customer}>
        {customer && <CustomerCard customer={customer} onIncreaseBalance={handleIncreaseBalance} />}
      </section>

      <hr/>

      <section className={styles.customerHeader}>
        <h2 className={styles.customerTitle}>Library</h2>
        <Search onSearch={handleSearch} onClearSearch={handleClear}/>
      </section>

      <section className={styles.library}>
        {filteredBooks.length > 0 ? (
          filteredBooks.map((storeBook) => (
            <BookCard
              key={storeBook.book.title}
              storeBook={storeBook}
              onRemove={() => handleRemove(storeBook)}
            />
          ))
        ) : (
          <p className={styles.customerMessage}>No books found</p>
        )}
      </section>

      <AddBook onAddBook={handleAddBook}/>
      <ErrorPopup message={message} onClose={() => dispatch(setMessage(''))} />
    </>
  );
};

export default CustomerPage;
