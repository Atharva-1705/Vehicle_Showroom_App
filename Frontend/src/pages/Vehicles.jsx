// src/pages/Vehicles.jsx
import React, { useState, useEffect } from 'react';
import { getVehicles, getCustomers, createVehicle, updateVehicle, deleteVehicle } from '../services/api';

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [currentVehicle, setCurrentVehicle] = useState({ RegistrationNo: '', Make: '', Model: '', CustomerID: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [vehicleId, setVehicleId] = useState(null);

  useEffect(() => {
    fetchVehicles();
    fetchCustomers();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await getVehicles();
      setVehicles(response.data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await getCustomers();
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentVehicle({ ...currentVehicle, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentVehicle.RegistrationNo || !currentVehicle.Make || !currentVehicle.CustomerID) {
      alert('Registration No, Make, and Customer are required.');
      return;
    }

    if (isEditing) {
      await updateVehicle(vehicleId, currentVehicle);
    } else {
      await createVehicle(currentVehicle);
    }
    resetForm();
    fetchVehicles();
  };

  const handleEdit = (vehicle) => {
    setIsEditing(true);
    setVehicleId(vehicle.VehicleID);
    setCurrentVehicle({
      RegistrationNo: vehicle.RegistrationNo,
      Make: vehicle.Make,
      Model: vehicle.Model,
      CustomerID: vehicle.CustomerID,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      await deleteVehicle(id);
      fetchVehicles();
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setVehicleId(null);
    setCurrentVehicle({ RegistrationNo: '', Make: '', Model: '', CustomerID: '' });
  };

  return (
    <div className="page-container">
      <h1 className="page-header">Vehicle Management</h1>

      <div className="form-container">
        <h2>{isEditing ? 'Edit Vehicle' : 'Add New Vehicle'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Registration Number</label>
            <input type="text" name="RegistrationNo" value={currentVehicle.RegistrationNo} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Make (e.g., Toyota)</label>
            <input type="text" name="Make" value={currentVehicle.Make} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Model (e.g., Corolla)</label>
            <input type="text" name="Model" value={currentVehicle.Model} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Customer</label>
            <select name="CustomerID" value={currentVehicle.CustomerID} onChange={handleInputChange} required>
              <option value="">Select a Customer</option>
              {customers.map((customer) => (
                <option key={customer.CustomerID} value={customer.CustomerID}>
                  {customer.FullName}
                </option>
              ))}
            </select>
          </div>
          <button type="submit">{isEditing ? 'Update Vehicle' : 'Add Vehicle'}</button>
          {isEditing && <button type="button" className="secondary" onClick={resetForm}>Cancel</button>}
        </form>
      </div>

      <h2>Existing Vehicles</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>Registration No</th>
            <th>Make</th>
            <th>Model</th>
            <th>Customer</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((vehicle) => (
            <tr key={vehicle.VehicleID}>
              <td>{vehicle.RegistrationNo}</td>
              <td>{vehicle.Make}</td>
              <td>{vehicle.Model}</td>
              <td>{vehicle.CustomerName}</td>
              <td>
                <button onClick={() => handleEdit(vehicle)}>Edit</button>
                <button className="danger" onClick={() => handleDelete(vehicle.VehicleID)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Vehicles;