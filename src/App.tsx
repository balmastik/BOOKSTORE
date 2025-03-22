import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './css/style.css';

import { fetchSubscribe } from './services/appServices';

import AppRoutes from './components/AppRoutes';
import Header from './components/Header';
import Footer from './components/Footer';
import ErrorPopup from './components/ErrorPopup';

const App = () => {
  const [message, setMessage] = useState<string>('');

  const handleSubscribe = async (email: string) => {
    try {
      const data = await fetchSubscribe.subscribe(email);
      setMessage(data);
    } catch (error) {
      setMessage(error as string);
    }
  };

  return (
    <Router>
      <div>
        <Header />
        <main>
          <AppRoutes />
        </main>
        <Footer onSubscribe={handleSubscribe} />
        <ErrorPopup message={message} onClose={() => setMessage('')} />
      </div>
    </Router>
  );
};

export default App;
