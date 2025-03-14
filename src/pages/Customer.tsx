import React, {useEffect, useState} from 'react';
import CustomerCard from '../components/CustomerCard';
import BookCard from '../components/BookCard';
import Search from "../components/Search";

interface BookData {
  title: string;
  author: string;
  genre: string;
  year: number;
  image: string;
  price: number;
  quantity: number;
}

interface StoreBook {
  book: BookData;
}

interface CustomerData {
  name: string;
  balance: number;
  image: string;
}

const Customer: React.FC = () => {
  const [customer, setCustomer] = useState<CustomerData | null>(null);
  const [books, setBooks] = useState<StoreBook[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<StoreBook[]>([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/customer')
      .then(res => res.json())
      .then(data => setCustomer(data))
      .catch(error => {
        console.error("Error loading customer:", error);
      });
  }, []);

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
          setCustomer(data);
        } else {
          alert(data.error);
        }
      })
      .catch(error => {
        console.error("Increase balance loading error:", error);
      });
  }

  useEffect(() => {
    fetch('http://localhost:3000/api/customer/books')
      .then((res) => res.json())
      .then((data) => {
        setBooks(data);
        setFilteredBooks(data);
      })
      .catch((error) => console.error('Error loading books:', error));
  }, []);

  const handleSearch = (query: string) => {
    fetch('http://localhost:3000/api/customer/books/search', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({query}),
    })
      .then((res) => res.json())
      .then((foundBooks) => {
        setFilteredBooks(foundBooks);
      })
      .catch((error) => console.error('Error searching books:', error));
  };

  return (
    <div>
      <section className="page-header">
        <h2 className="page-header-title">Customer</h2>
        {customer ? (
          <CustomerCard customer={customer} onIncreaseBalance={handleIncreaseBalance}/>
        ) : (
          <p>Loading customer data...</p>
        )}
      </section>

      <section className="page-header">
        <h2 className="page-header-title">Library</h2>
      <Search onSearch={handleSearch}/>
      </section>

      <section className="book-list">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((storeBook) => (
            <BookCard
              key={storeBook.book.title}
              storeBook={storeBook}
              onPurchase={() => alert(`Purchase ${storeBook.book.title}`)}
            />
          ))
        ) : (
          <p>No books found</p>
        )}
      </section>
    </div>
  );
};

export default Customer;
