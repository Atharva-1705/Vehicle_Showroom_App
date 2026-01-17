// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Customers from './pages/Customers.jsx';
import Vehicles from './pages/Vehicles.jsx';
import Mechanics from './pages/Mechanics.jsx';
import ServiceJobs from './pages/ServiceJobs.jsx';
import Parts from './pages/Parts.jsx';
import Invoices from './pages/Invoices.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="customers" element={<Customers />} />
          <Route path="vehicles" element={<Vehicles />} />
          <Route path="mechanics" element={<Mechanics />} />
          <Route path="jobs" element={<ServiceJobs />} />
          <Route path="parts" element={<Parts />} />
          <Route path="invoices" element={<Invoices />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;