// src/pages/ServiceJobs.jsx
import React, { useState, useEffect } from 'react';
import {
  getServiceJobs, createServiceJob, getVehicles, getMechanics, updateServiceJobStatus,
  getParts, getJobParts, addPartToJob, removePartFromJob
} from '../services/api';

const ServiceJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [currentJob, setCurrentJob] = useState({ VehicleID: '', MechanicID: '', Date: '', Notes: '' });

  // State for Labor Charges Modal
  const [isLaborModalOpen, setIsLaborModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [laborCharges, setLaborCharges] = useState('');

  // State for Parts Management Modal
  const [isPartsModalOpen, setIsPartsModalOpen] = useState(false);
  const [allParts, setAllParts] = useState([]); // All parts from inventory
  const [jobParts, setJobParts] = useState([]); // Parts for the selected job
  const [newPart, setNewPart] = useState({ partId: '', quantity: 1 });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setJobs((await getServiceJobs()).data);
      setVehicles((await getVehicles()).data);
      setMechanics((await getMechanics()).data);
      setAllParts((await getParts()).data);
    } catch (error) {
      console.error("Failed to fetch initial data:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentJob({ ...currentJob, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentJob.VehicleID || !currentJob.Date) {
      alert('Vehicle and Date are required to create a job.');
      return;
    }
    await createServiceJob(currentJob);
    setCurrentJob({ VehicleID: '', MechanicID: '', Date: '', Notes: '' });
    fetchInitialData();
  };

  // Labor Modal Logic
  const openLaborModal = (jobId) => {
    setSelectedJobId(jobId);
    setIsLaborModalOpen(true);
  };

  const handleCompleteJobSubmit = async (e) => {
    e.preventDefault();
    if (laborCharges < 0 || laborCharges === '') return alert('Please enter a valid labor charge.');
    await updateServiceJobStatus(selectedJobId, 'Completed', laborCharges);
    setIsLaborModalOpen(false);
    setLaborCharges('');
    fetchInitialData();
  };

  // Parts Modal Logic
  const openPartsModal = async (jobId) => {
    setSelectedJobId(jobId);
    const response = await getJobParts(jobId);
    setJobParts(response.data);
    setIsPartsModalOpen(true);
  };

  const handleAddPart = async (e) => {
    e.preventDefault();
    if (!newPart.partId || newPart.quantity <= 0) return alert('Please select a part and enter a valid quantity.');
    await addPartToJob(selectedJobId, newPart.partId, newPart.quantity);
    setNewPart({ partId: '', quantity: 1 });
    const response = await getJobParts(selectedJobId);
    setJobParts(response.data);
  };

  const handleRemovePart = async (jobPartId) => {
    await removePartFromJob(jobPartId);
    const response = await getJobParts(selectedJobId);
    setJobParts(response.data);
  };

  // Other Status Updates
  const handleStatusUpdate = async (jobId, newStatus) => {
    await updateServiceJobStatus(jobId, newStatus, 0);
    fetchInitialData();
  };

  return (
    <div className="page-container">
      {/* --- Labor Charges Modal --- */}
      {isLaborModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Complete Job & Generate Invoice</h2>
            <p>Enter the labor charges for Job ID: {selectedJobId}</p>
            <form onSubmit={handleCompleteJobSubmit}>
              <div className="form-group">
                <label>Labor Charges (₹)</label>
                <input
                  type="number"
                  value={laborCharges}
                  onChange={(e) => setLaborCharges(e.target.value)}
                  placeholder="e.g., 500"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <button type="submit">Complete & Invoice</button>
              <button type="button" className="secondary" onClick={() => setIsLaborModalOpen(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}

      {/* --- Parts Management Modal --- */}
      {isPartsModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Manage Parts for Job ID: {selectedJobId}</h2>
            <form onSubmit={handleAddPart} className="form-container" style={{ marginBottom: '20px' }}>
              <div className="form-group">
                <label>Spare Part</label>
                <select value={newPart.partId} onChange={(e) => setNewPart({ ...newPart, partId: e.target.value })} required>
                  <option value="">Select a part</option>
                  {allParts.map(p => <option key={p.PartID} value={p.PartID}>{p.Name} (₹{p.Price})</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Quantity</label>
                <input type="number" value={newPart.quantity} onChange={(e) => setNewPart({ ...newPart, quantity: e.target.value })} min="1" required />
              </div>
              <button type="submit">Add Part</button>
            </form>
            
            <h3>Parts Used on This Job</h3>
            <table className="data-table">
              <thead>
                <tr><th>Part Name</th><th>Quantity</th><th>Price</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {jobParts.map(jp => (
                  <tr key={jp.JobPartID}>
                    <td>{jp.Name}</td>
                    <td>{jp.QuantityUsed}</td>
                    <td>₹{jp.Price}</td>
                    <td><button className="danger" onClick={() => handleRemovePart(jp.JobPartID)}>Remove</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button type="button" className="secondary" style={{ marginTop: '20px' }} onClick={() => setIsPartsModalOpen(false)}>Close</button>
          </div>
        </div>
      )}

      <h1 className="page-header">Service Job Management</h1>
      
      <div className="form-container">
        <h2>Create New Service Job</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Vehicle (by Registration No)</label>
            <select name="VehicleID" value={currentJob.VehicleID} onChange={handleInputChange} required>
              <option value="">Select a Vehicle</option>
              {vehicles.map(v => <option key={v.VehicleID} value={v.VehicleID}>{v.RegistrationNo} - ({v.CustomerName})</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Assign Mechanic (Optional)</label>
            <select name="MechanicID" value={currentJob.MechanicID} onChange={handleInputChange}>
              <option value="">Select a Mechanic</option>
              {mechanics.map(m => <option key={m.MechanicID} value={m.MechanicID}>{m.Name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Date</label>
            <input type="date" name="Date" value={currentJob.Date} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Notes / Description of Work</label>
            <input type="text" name="Notes" value={currentJob.Notes} onChange={handleInputChange} />
          </div>
          <button type="submit">Create Job</button>
        </form>
      </div>

      <h2>Current Service Jobs</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>Job ID</th>
            <th>Vehicle</th>
            <th>Customer</th>
            <th>Mechanic</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map(job => (
            <tr key={job.JobID}>
              <td>{job.JobID}</td>
              <td>{job.RegistrationNo}</td>
              <td>{job.CustomerName}</td>
              <td>{job.MechanicName || 'Not Assigned'}</td>
              <td>{new Date(job.Date).toLocaleDateString()}</td>
              <td>{job.Status}</td>
              <td>
                <button onClick={() => openPartsModal(job.JobID)}>Manage Parts</button>
                {job.Status === 'Assigned' && <button onClick={() => handleStatusUpdate(job.JobID, 'In Progress')}>Start Job</button>}
                {job.Status === 'In Progress' && <button onClick={() => openLaborModal(job.JobID)}>Mark Completed</button>}
                {(job.Status === 'Completed' || job.Status === 'Invoiced') && <span>✔️ Done</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
// src/pages/ServiceJobs.jsx

const handleGenerateInvoice = async () => {
  if (laborCharges < 0 || laborCharges === '') {
      return alert('Please enter valid labor charges.');
  }
  try {
      await generateInvoice(selectedJobId, laborCharges);
      alert('Invoice generated successfully!'); // Success message
      setIsModalOpen(false);
      setLaborCharges('');
      fetchInitialData();
  } catch (error) {
      console.error("Error generating invoice:", error);
      alert('Failed to generate invoice. Check the console for details.'); // Error message
  }
};

export default ServiceJobs;