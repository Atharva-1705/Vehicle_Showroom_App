// src/components/Layout.jsx
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './Layout.css';

const Layout = () => {
  return (
    <div className="app-layout">
      <nav className="sidebar">
        <h1 className="sidebar-title">VSMS 🚗</h1>
        <ul>
          <li><NavLink to="/">Dashboard</NavLink></li>
          <li><NavLink to="/customers">Customers</NavLink></li>
          <li><NavLink to="/vehicles">Vehicles</NavLink></li>
          <li><NavLink to="/mechanics">Mechanics</NavLink></li>
          <li><NavLink to="/jobs">Service Jobs</NavLink></li>
          <li><NavLink to="/parts">Spare Parts</NavLink></li>
          <li><NavLink to="/invoices">Invoices</NavLink></li>
        </ul>
      </nav>
      <main className="main-content">
        <Outlet /> {/* Child routes will render here */}
      </main>
    </div>
  );
};

export default Layout;