// src/pages/Invoices.jsx
import React, { useState, useEffect } from 'react';
import { getInvoices, updateInvoiceStatus } from '../services/api';

const Invoices = () => {
    const [invoices, setInvoices] = useState([]);

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            const response = await getInvoices();
            setInvoices(response.data);
        } catch (error) {
            console.error("Error fetching invoices:", error);
        }
    };

    const handleStatusUpdate = async (invoiceId, newStatus) => {
        // Add a confirmation before changing the status
        if (window.confirm(`Are you sure you want to mark this invoice as ${newStatus}?`)) {
            try {
                await updateInvoiceStatus(invoiceId, newStatus);
                // Refresh the list of invoices to show the change immediately
                fetchInvoices();
            } catch (error) {
                console.error("Failed to update invoice status:", error);
                alert('There was an error updating the invoice status.');
            }
        }
    };

    return (
        <div className="page-container">
            <h1 className="page-header">Billing & Invoices</h1>

            <h2>Generated Invoices</h2>
            <table className="data-table">
                <thead>
                    <tr>
                        <th>Invoice ID</th>
                        <th>Job ID</th>
                        <th>Customer</th>
                        <th>Amount</th>
                        <th>Date Issued</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {invoices.length > 0 ? (
                        invoices.map(invoice => (
                            <tr key={invoice.InvoiceID}>
                                <td>{invoice.InvoiceID}</td>
                                <td>{invoice.JobID}</td>
                                <td>{invoice.CustomerName}</td>
                                <td>₹{parseFloat(invoice.Amount).toFixed(2)}</td>
                                <td>{new Date(invoice.DateIssued).toLocaleDateString()}</td>
                                <td>{invoice.Status}</td>
                                <td>
                                    {invoice.Status === 'Unpaid' && (
                                        <button onClick={() => handleStatusUpdate(invoice.InvoiceID, 'Paid')}>
                                            Mark as Paid
                                        </button>
                                    )}
                                    {invoice.Status === 'Paid' && (
                                        <span style={{ color: 'green' }}>✔️ Paid</span>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7">No invoices have been generated yet.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Invoices;