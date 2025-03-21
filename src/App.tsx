import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './css/style.css';

import {fetchSubscribe} from './customerServices/fetchSubscribe';

import Routes from './components/Routes';
import Header from './components/Header';
import Footer from './components/Footer';
import ErrorPopup from './components/ErrorPopup';

const App = () => {
  const [message, setMessage] = useState<string>('');

  const handleSubscribe = (email: string) => {
    fetchSubscribe.subscribe(email)
      .then((data) => {
          setMessage(data);
        })
      .catch((error) => setMessage(error.message));
  }

  return (
    <Router>
      <div>
        <Header />
        <main>
          <Routes />
        </main>
        <Footer onSubscribe={handleSubscribe} />
        <ErrorPopUp message={message} onClose={() => setMessage(null)} />
      </div>
    </Router>
  );
};

export default App;
