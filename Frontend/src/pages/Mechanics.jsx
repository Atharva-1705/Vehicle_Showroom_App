// src/pages/Mechanics.jsx
import React, { useState, useEffect } from 'react';
import { getMechanics, createMechanic, deleteMechanic } from '../services/api';

const Mechanics = () => {
  const [mechanics, setMechanics] = useState([]);
  const [currentMechanic, setCurrentMechanic] = useState({ Name: '', Phone: '' });

  useEffect(() => {
    fetchMechanics();
  }, []);

  const fetchMechanics = async () => {
    try {
      const response = await getMechanics();
      setMechanics(response.data);
    } catch (error) {
      console.error("Error fetching mechanics:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentMechanic({ ...currentMechanic, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentMechanic.Name) {
      alert('Mechanic name is required.');
      return;
    }
    await createMechanic(currentMechanic);
    resetForm();
    fetchMechanics();
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this mechanic?')) {
        await deleteMechanic(id);
        fetchMechanics();
    }
  };

  const resetForm = () => {
    setCurrentMechanic({ Name: '', Phone: '' });
  };

  return (
    <div className="page-container">
      <h1 className="page-header">Mechanic Management</h1>

      <div className="form-container">
        <h2>Add New Mechanic</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="Name" value={currentMechanic.Name} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input type="text" name="Phone" value={currentMechanic.Phone} onChange={handleInputChange} maxLength="10" />
          </div>
          <button type="submit">Add Mechanic</button>
        </form>
      </div>

      <h2>Existing Mechanics</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {mechanics.map((mechanic) => (
            <tr key={mechanic.MechanicID}>
              <td>{mechanic.Name}</td>
              <td>{mechanic.Phone}</td>
              <td>
                <button className="danger" onClick={() => handleDelete(mechanic.MechanicID)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Mechanics;