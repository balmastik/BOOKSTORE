import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Catalogue from '../pages/Catalogue';
import Customer from '../pages/Customer';

const Routes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Catalogue />} />
      <Route path="/customer" element={<Customer />} />
    </Routes>
  );
};

export default Routes;
