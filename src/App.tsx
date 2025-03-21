import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './css/style.css';

import Routes from './components/Routes';
import Header from './components/Header';
import Footer from './components/Footer';
import ErrorPopUp from './components/ErrorPopUp';

import {fetchSubscribe} from './components/customerServices/FetchSubscribe';

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
