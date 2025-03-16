import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Footer from './components/Footer';
import Catalogue from './pages/Catalogue';
import Customer from './pages/Customer';

const App = () => {
  const [message, setMessage] = useState<string>('');

  const handleSubscribe = (email: string) => {
    fetch('http://localhost:3000/api/subscriber', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({email}),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMessage('You have successfully subscribed to our newsletter!');
          setTimeout(() => setMessage(''), 3000);
        } else {
          alert(data.error);
        }
      })
      .catch((error) => console.error('Error subscribing mail:', error));
  }

  return (
    <Router>
      <div className="App">
        <main>
          <Routes>
            <Route path="/" element={<Catalogue />} />
            <Route path="/customer" element={<Customer />} />
          </Routes>
        </main>
        <Footer onSubscribe={handleSubscribe} message={message} />
      </div>
    </Router>
  );
};

export default App;
