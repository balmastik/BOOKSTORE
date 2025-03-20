import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './css/style.css';

import Header from './components/Header';
import Routes from './components/Routes';
import Footer from './components/Footer';

import {subscriberService} from './components/customerServices/SubscriberService';

const App = () => {
  const [message, setMessage] = useState<string>('');


  const handleSubscribe = (email: string) => {
    subscriberService.subscribe(email)
      .then(() => {
          setMessage('You have successfully subscribed to our newsletter!');
          setTimeout(() => setMessage(''), 3000);
        })
      .catch((error) => {
        if (error.message.includes('already been subscribed')) {
          setMessage('You are already subscribed to the newsletter.');
          setTimeout(() => setMessage(''), 3000);
        } else {
          setMessage('An error occurred while subscribing. Please try again later.');
          setTimeout(() => setMessage(''), 3000);
        }
      });
  }

  return (
    <Router>
      <div className="App">
        <Header onClearSearch={handleClearSearch} />
        <main>
          <Routes />
        </main>
        <Footer onSubscribe={handleSubscribe} message={message} />
      </div>
    </Router>
  );
};

export default App;
