// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// --- Customer API ---
export const getCustomers = () => apiClient.get('/customers');
export const createCustomer = (customer) => apiClient.post('/customers', customer);
export const updateCustomer = (id, customer) => apiClient.put(`/customers/${id}`, customer);
export const deleteCustomer = (id) => apiClient.delete(`/customers/${id}`);

// --- Vehicle API ---
export const getVehicles = () => apiClient.get('/vehicles');
export const createVehicle = (vehicle) => apiClient.post('/vehicles', vehicle);
export const updateVehicle = (id, vehicle) => apiClient.put(`/vehicles/${id}`, vehicle);
export const deleteVehicle = (id) => apiClient.delete(`/vehicles/${id}`);

// --- Mechanic API --- (Add this)
export const getMechanics = () => apiClient.get('/mechanics');
export const createMechanic = (mechanic) => apiClient.post('/mechanics', mechanic);
export const deleteMechanic = (id) => apiClient.delete(`/mechanics/${id}`);

// --- Spare Part API --- (Add this)
export const getParts = () => apiClient.get('/parts');
export const createPart = (part) => apiClient.post('/parts', part);

// Add these to the end of your api.js file



// --- Invoice API ---
export const getInvoices = () => apiClient.get('/invoices');

// src/services/api.js

// --- Service Job API ---
export const getServiceJobs = () => apiClient.get('/jobs');
export const createServiceJob = (job) => apiClient.post('/jobs', job);
// Modified function:
export const updateServiceJobStatus = (id, status, laborCharges) => 
    apiClient.put(`/jobs/${id}/status`, { status, laborCharges }); 
// src/services/api.js

// --- Job Parts API ---
export const getJobParts = (jobId) => apiClient.get(`/jobs/${jobId}/parts`);
export const addPartToJob = (jobId, partId, quantity) => apiClient.post(`/jobs/${jobId}/parts`, { partId, quantity });
export const removePartFromJob = (jobPartId) => apiClient.delete(`/job-parts/${jobPartId}`);

// src/services/api.js

// --- Invoice API ---

export const updateInvoiceStatus = (id, status) => apiClient.put(`/invoices/${id}/status`, { status });