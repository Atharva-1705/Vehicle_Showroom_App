// src/pages/Parts.jsx
import React, { useState, useEffect } from 'react';
import { getParts, createPart } from '../services/api';

const Parts = () => {
  const [parts, setParts] = useState([]);
  const [currentPart, setCurrentPart] = useState({ Name: '', Stock: '', Price: '' });

  useEffect(() => {
    fetchParts();
  }, []);

  const fetchParts = async () => {
    try {
      const response = await getParts();
      setParts(response.data);
    } catch (error) {
      console.error("Error fetching parts:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentPart({ ...currentPart, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentPart.Name || currentPart.Stock < 0 || currentPart.Price < 0) {
      alert('Valid Part Name, Stock, and Price are required.');
      return;
    }
    await createPart(currentPart);
    resetForm();
    fetchParts();
  };

  const resetForm = () => {
    setCurrentPart({ Name: '', Stock: '', Price: '' });
  };

  return (
    <div className="page-container">
      <h1 className="page-header">Spare Parts Inventory</h1>

      <div className="form-container">
        <h2>Add New Part</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Part Name</label>
            <input type="text" name="Name" value={currentPart.Name} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Stock Quantity</label>
            <input type="number" name="Stock" value={currentPart.Stock} onChange={handleInputChange} min="0" required />
          </div>
          <div className="form-group">
            <label>Price</label>
            <input type="number" name="Price" value={currentPart.Price} onChange={handleInputChange} min="0" step="0.01" required />
          </div>
          <button type="submit">Add Part</button>
        </form>
      </div>

      <h2>Existing Parts</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>Part Name</th>
            <th>Stock</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {parts.map((part) => (
            <tr key={part.PartID}>
              <td>{part.Name}</td>
              <td>{part.Stock}</td>
              <td>{part.Price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Parts;