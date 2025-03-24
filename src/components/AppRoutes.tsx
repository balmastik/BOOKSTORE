import React from 'react';
import {Route, Routes as RouterRoutes} from 'react-router-dom';
import CataloguePage from '../pages/CataloguePage';
import CustomerPage from '../pages/CustomerPage';

const AppRoutes: React.FC = () => {
  return (
    <RouterRoutes>
      <Route path="/" element={<CataloguePage/>}/>
      <Route path="/customer" element={<CustomerPage/>}/>
    </RouterRoutes>
  );
};

export default AppRoutes;
