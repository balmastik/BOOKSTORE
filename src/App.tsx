import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Catalogue from './pages/Catalogue';
import Customer from './pages/Customer';
import Header from './components/Header';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <main>
        <Switch>
          <Route path="/" exact component={Catalogue} />
          <Route path="/customer" component={Customer} />
        </Switch>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
