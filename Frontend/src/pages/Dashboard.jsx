// src/pages/Dashboard.jsx
import React from 'react';
// Corrected import: 'garageImage' (with a capital 'I' for consistency, though 'garageimage' would also work if you use it consistently)
import garageImage from '../assets/garageimage.png'; // Make sure this matches the filename exactly

const Dashboard = () => {
  return (
    <div className="page-container">
      <h1 className="page-header">Vehicle Service Management System</h1>
      <p>Welcome to the Vehicle Service Management System.</p>
      
      {/* Use the imported variable name */}
      <img 
        src={garageImage} 
        alt="A modern car garage with tools" 
        className="dashboard-image" 
      />
    </div>
  );
};

export default Dashboard;