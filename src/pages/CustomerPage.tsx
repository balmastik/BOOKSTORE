import React, {useEffect, useState} from 'react';
import styles from './CustomerPage.module.css';
import {StoreBook, Customer} from '../interfaces/entities';
import {customerServices} from '../services/customerServices';
import CustomerCard from '../components/CustomerCard/CustomerCard';
import BookCard from '../components/BookCard/BookCard';
import Search from '../components/Search/Search';
import AddBook from '../components/AddBook/AddBook';
import ErrorPopup from '../components/ErrorPopup/ErrorPopup';
import {useReloadLibrary} from '../context/ReloadLibraryContext';

const CustomerPage: React.FC = () => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [books, setBooks] = useState<StoreBook[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<StoreBook[]>([]);
  const [message, setMessage] = useState<string>('');
  const {reloadLibrary} = useReloadLibrary();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await customerServices.displayCustomer();
        setCustomer(data);
        setMessage('');
      } catch (error) {
        setMessage(error as string);
      }
    };
    fetchData();
  }, []);

  const handleIncreaseBalance = async () => {
    const amount: number = parseFloat(prompt('Please enter the amount, 0') || '0');
    if (isNaN(amount) || amount <= 0) {
      setMessage('Please enter a valid positive number');
      return;
    }

    try {
      const data = await customerServices.increase(amount);
      setCustomer(data);
      setMessage('Balance has been successfully increased');
    } catch (error) {
      setMessage(error as string);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await customerServices.displayLibrary();
        setBooks(data);
        setFilteredBooks(data);
        setMessage('');
      } catch (error) {
        setMessage(error as string);
      }
    };
    fetchData();
  }, [reloadLibrary]);

  const handleRemove = async (storeBook: StoreBook) => {
    try {
      const data = await customerServices.remove(storeBook);
      setFilteredBooks(data);
      setMessage('Book has been successfully removed from the library');
    } catch (error) {
      setMessage(error as string);
    }
  };

  const handleSearch = async (query: string) => {
    try {
      const data = await customerServices.search(query);
      setFilteredBooks(data);
      setMessage('');
    } catch (error) {
      setMessage(error as string);
    }
  };

  const handleClearSearch = () => {
    setFilteredBooks(books);
  }

  const handleAddBook = async (title: string, author: string, image: File) => {
    try {
      const data = await customerServices.add(title, author, image);
      setFilteredBooks(data);
      setMessage('Book has been added to the library');
    } catch (error) {
      setMessage(error as string);
    }
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
        <Search onSearch={handleSearch} onClearSearch={handleClearSearch}/>
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
      <ErrorPopup message={message} onClose={() => setMessage('')}/>
    </>
  );
};

export default CustomerPage;
