// src/pages/Customers.jsx
import React, { useState, useEffect } from 'react';
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from '../services/api';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [currentCustomer, setCurrentCustomer] = useState({ FullName: '', Email: '', Phone: '', Address: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [customerId, setCustomerId] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

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
    setCurrentCustomer({ ...currentCustomer, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentCustomer.FullName || !currentCustomer.Email) {
        alert('Full Name and Email are required.');
        return;
    }

    if (isEditing) {
      await updateCustomer(customerId, currentCustomer);
    } else {
      await createCustomer(currentCustomer);
    }
    resetForm();
    fetchCustomers();
  };

  const handleEdit = (customer) => {
    setIsEditing(true);
    setCustomerId(customer.CustomerID);
    setCurrentCustomer({ FullName: customer.FullName, Email: customer.Email, Phone: customer.Phone, Address: customer.Address });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
        await deleteCustomer(id);
        fetchCustomers();
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setCustomerId(null);
    setCurrentCustomer({ FullName: '', Email: '', Phone: '', Address: '' });
  };

  return (
    <div className="page-container">
      <h1 className="page-header">Customer Management</h1>

      <div className="form-container">
        <h2>{isEditing ? 'Edit Customer' : 'Add New Customer'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="FullName" value={currentCustomer.FullName} onChange={handleInputChange} placeholder="John Doe" required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="Email" value={currentCustomer.Email} onChange={handleInputChange} placeholder="john.doe@example.com" required />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input type="text" name="Phone" value={currentCustomer.Phone} onChange={handleInputChange} placeholder="10-digit phone number" maxLength="10" />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input type="text" name="Address" value={currentCustomer.Address} onChange={handleInputChange} placeholder="123 Main St, City" />
          </div>
          <button type="submit">{isEditing ? 'Update Customer' : 'Add Customer'}</button>
          {isEditing && <button type="button" className="secondary" onClick={resetForm}>Cancel</button>}
        </form>
      </div>

      <h2>Existing Customers</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.CustomerID}>
              <td>{customer.FullName}</td>
              <td>{customer.Email}</td>
              <td>{customer.Phone}</td>
              <td>{customer.Address}</td>
              <td>
                <button onClick={() => handleEdit(customer)}>Edit</button>
                <button className="danger" onClick={() => handleDelete(customer.CustomerID)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Customers;