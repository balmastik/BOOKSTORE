import React from 'react';
import {Route, Routes} from 'react-router-dom';
import CataloguePage from '../pages/CataloguePage';
import CustomerPage from '../pages/CustomerPage';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/catalogue" element={<CataloguePage/>}/>
      <Route path="/customer" element={<CustomerPage/>}/>
    </Routes>
  );
};

export default AppRoutes;
