import React, {useState} from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import './styles/globals.module.css';
import Header from './components/Header/Header';
import AppRoutes from './components/AppRoutes';
import Footer from './components/Footer/Footer';
import {fetchSubscribe} from './services/appServices';

const App = () => {
  const [message, setMessage] = useState<string>('');

  const handleSubscribe = async (email: string) => {
    try {
      const data = await fetchSubscribe.subscribe(email);
      setMessage(data);
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      setMessage(error as string);
      setTimeout(() => setMessage(''), 2000);
    }
  };

  return (
    <Router>
      <div>
        <Header/>
        <main>
          <AppRoutes/>
        </main>
        <Footer onSubscribe={handleSubscribe} message={message}/>
      </div>
    </Router>
  );
};

export default App;
