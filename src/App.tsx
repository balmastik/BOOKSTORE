import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import {ReloadLibraryProvider} from './context/ReloadLibraryContext';
import './styles/globals.module.css';
import {useDispatch, useSelector} from 'react-redux';
import {RootState, AppDispatch} from './redux/store';
import {subscribeEmail, setMessage} from './redux/appSlice';
import Header from './components/Header/Header';
import AppRoutes from './components/AppRoutes';
import Footer from './components/Footer/Footer';

const App = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {message} = useSelector((state: RootState) => state.app);

  const handleSubscribe = async (email: string) => {
    dispatch(subscribeEmail(email));
    setTimeout(() => dispatch(setMessage('')), 2000);
  };

  return (
    <ReloadLibraryProvider>
      <Router>
        <div>
          <Header/>
          <main>
            <AppRoutes/>
          </main>
          <Footer onSubscribe={handleSubscribe} message={message}/>
        </div>
      </Router>
    </ReloadLibraryProvider>
  );
};

export default App;
