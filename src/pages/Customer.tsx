import React, {useEffect, useState} from 'react';

import {StoreBook, CustomerData} from '../interfaces/entitites';
import CustomerCard from '../components/CustomerCard';
import BookCard from '../components/BookCard';
import Search from '../components/Search';
import AddBookForm from '../components/AddBookForm';

import {useReloadLibrary} from '../context/ReloadLibraryContext';

const Customer: React.FC<CustomerProps> = () => {
  const [customer, setCustomer] = useState<CustomerData | null>(null);
  const [books, setBooks] = useState<StoreBook[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<StoreBook[]>([]);
  const {reloadLibrary} = useReloadLibrary();

  useEffect(() => {
    fetch('http://localhost:3000/api/customer')
      .then(res => res.json())
      .then(data => setCustomer(data))
      .catch((error) => console.error("Error loading customer:", error));
  }, [])

  const handleIncreaseBalance = () => {
    const amount: number = parseFloat(prompt('Please enter the amount, 0') || '0');
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid positive number');
      return;
    }

    fetch('http://localhost:3000/api/customer/balance/increase', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({amount}),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert(data.message);
          setCustomer(data.customer);
        } else {
          alert(data.error);
        }
      })
      .catch((error) => console.error("Error increasing balance:", error));
  }

  useEffect(() => {
    fetch('http://localhost:3000/api/customer/books')
      .then((res) => res.json())
      .then((data) => {
        setBooks(data);
        setFilteredBooks(data);
      })
      .catch((error) => console.error('Error loading books:', error));
  }, [reloadLibrary])

  const handleRemove = (storeBook: StoreBook) => {
    fetch('http://localhost:3000/api/customer/books', {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json',},
      body: JSON.stringify(storeBook)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setFilteredBooks(data.books);
        } else {
          alert(data.error);
        }
      })
      .catch((error) => console.error("Error removing book:", error));
  }

  const handleSearch = (query: string) => {
    fetch('http://localhost:3000/api/customer/books/search', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({query}),
    })
      .then((res) => res.json())
      .then(data => {
        if (data.success) {
          setFilteredBooks(data.books);
        } else {
          alert(data.error);
        }
      })
      .catch((error) => console.error('Error searching books:', error));
  }

  const handleClearSearch = () => {
    setFilteredBooks(books);
  }

  const handleAddBook = (title: string, author: string, image: File) => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('author', author);
    formData.append('image', image);

    fetch('http://localhost:3000/api/customer/books/add', {
      method: 'POST',
      body: formData,
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setFilteredBooks(data.books);
          setTimeout(() => alert(data.message), 1000);
        } else {
          alert(data.error);
        }
      })
      .catch((error) => console.error('Error adding book:', error));
  }

  return (
    <>
      <section className="page-header">
        <h2 className="page-header-title">Customer</h2>
      </section>

      <section className="customer-list">
        {customer ? (
          <CustomerCard customer={customer} onIncreaseBalance={handleIncreaseBalance} />
        ) : (
          <p className="inform-message">Loading customer data...</p>
        )}
      </section>

      <hr />

      <section className="page-header">
        <h2 className="page-header-title">Library</h2>
        <Search onSearch={handleSearch} onClearSearch={handleClearSearch} />
      </section>

      <section className="customer-book-list">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((storeBook) => (
            <BookCard
              key={storeBook.book.title}
              storeBook={storeBook}
              showPrice={false}
              onRemove={() => handleRemove(storeBook)}
            />
          ))
        ) : (
          <p className="inform-message">No books found</p>
        )}
      </section>

      <section className="add-book">
        <h2 className="add-book-title">Add a Book to the Library</h2>
        <AddBookForm onAddBook={handleAddBook} />
      </section>
    </>
  );
};

export default Customer;
