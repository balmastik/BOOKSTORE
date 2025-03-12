import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Catalogue from "./pages/Catalogue";
import Customer from "./pages/Customer";

const App = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    const response = await fetch('http://localhost:3000/api/customer');
    const data = await response.json();
    setCustomers(data);
  };

  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Switch>
            <Route path="/" exact>
              {/* Главная страница с каталогом книг */}
              <Catalogue />
            </Route>
            <Route path="/customer" exact>
              {/* Страница покупателя */}
              <Customer />
            </Route>
          </Switch>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
