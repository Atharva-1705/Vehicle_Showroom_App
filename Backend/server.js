// server.js
const express = require('express');
const cors = require('cors');
const db = require('./db'); // Database connection (MySQL / MariaDB)

const app = express();
const PORT = 8080;

// ==================== MIDDLEWARE ====================
app.use(cors());
app.use(express.json());

// ====================================================
// ==================== CUSTOMER API ==================
// ====================================================

// GET all customers
app.get('/api/customers', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Customer');
    res.json(rows);
  } catch (error) {
    console.error("Failed to fetch customers:", error);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// POST new customer
app.post('/api/customers', async (req, res) => {
  try {
    const { FullName, Email, Phone, Address } = req.body;
    if (!FullName || !Email) {
      return res.status(400).json({ error: 'FullName and Email are required' });
    }
    const [result] = await db.query(
      'INSERT INTO Customer (FullName, Email, Phone, Address) VALUES (?, ?, ?, ?)',
      [FullName, Email, Phone, Address]
    );
    res.status(201).json({ CustomerID: result.insertId, ...req.body });
  } catch (error) {
    console.error("Failed to create customer:", error);
    res.status(500).json({ error: 'Database insert failed' });
  }
});

// PUT update customer
app.put('/api/customers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { FullName, Email, Phone, Address } = req.body;
    await db.query(
      'UPDATE Customer SET FullName = ?, Email = ?, Phone = ?, Address = ? WHERE CustomerID = ?',
      [FullName, Email, Phone, Address, id]
    );
    res.json({ message: 'Customer updated successfully' });
  } catch (error) {
    console.error("Failed to update customer:", error);
    res.status(500).json({ error: 'Database update failed' });
  }
});

// DELETE customer
app.delete('/api/customers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM Customer WHERE CustomerID = ?', [id]);
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error("Failed to delete customer:", error);
    res.status(500).json({ error: 'Database delete failed' });
  }
});

// ====================================================
// ==================== VEHICLE API ===================
// ====================================================

// GET all vehicles with customer name
app.get('/api/vehicles', async (req, res) => {
  try {
    const query = `
      SELECT v.VehicleID, v.RegistrationNo, v.Make, v.Model, c.FullName AS CustomerName, v.CustomerID
      FROM Vehicle v
      JOIN Customer c ON v.CustomerID = c.CustomerID
    `;
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (error) {
    console.error("Failed to fetch vehicles:", error);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// POST new vehicle
app.post('/api/vehicles', async (req, res) => {
  try {
    const { RegistrationNo, Make, Model, CustomerID } = req.body;
    const [result] = await db.query(
      'INSERT INTO Vehicle (RegistrationNo, Make, Model, CustomerID) VALUES (?, ?, ?, ?)',
      [RegistrationNo, Make, Model, CustomerID]
    );
    res.status(201).json({ VehicleID: result.insertId, ...req.body });
  } catch (error) {
    console.error("Failed to create vehicle:", error);
    res.status(500).json({ error: 'Database insert failed' });
  }
});

// PUT update vehicle
app.put('/api/vehicles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { RegistrationNo, Make, Model, CustomerID } = req.body;
    await db.query(
      'UPDATE Vehicle SET RegistrationNo = ?, Make = ?, Model = ?, CustomerID = ? WHERE VehicleID = ?',
      [RegistrationNo, Make, Model, CustomerID, id]
    );
    res.json({ message: 'Vehicle updated successfully' });
  } catch (error) {
    console.error("Failed to update vehicle:", error);
    res.status(500).json({ error: 'Database update failed' });
  }
});

// DELETE vehicle
app.delete('/api/vehicles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM Vehicle WHERE VehicleID = ?', [id]);
    res.json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    console.error("Failed to delete vehicle:", error);
    res.status(500).json({ error: 'Database delete failed' });
  }
});

// ====================================================
// ==================== MECHANIC API ==================
// ====================================================

app.get('/api/mechanics', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Mechanic');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Database query failed' });
  }
});

app.post('/api/mechanics', async (req, res) => {
  try {
    const { Name, Phone } = req.body;
    const [result] = await db.query(
      'INSERT INTO Mechanic (Name, Phone) VALUES (?, ?)',
      [Name, Phone]
    );
    res.status(201).json({ MechanicID: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ error: 'Database insert failed' });
  }
});

app.delete('/api/mechanics/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM Mechanic WHERE MechanicID = ?', [id]);
    res.json({ message: 'Mechanic deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Database delete failed' });
  }
});

// ====================================================
// ================== SPARE PARTS API =================
// ====================================================

app.get('/api/parts', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM SparePart');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Database query failed' });
  }
});

app.post('/api/parts', async (req, res) => {
  try {
    const { Name, Stock, Price } = req.body;
    const [result] = await db.query(
      'INSERT INTO SparePart (Name, Stock, Price) VALUES (?, ?, ?)',
      [Name, Stock, Price]
    );
    res.status(201).json({ PartID: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ error: 'Database insert failed' });
  }
});

// ====================================================
// ================== SERVICE JOB API =================
// ====================================================

// GET all jobs with details
app.get('/api/jobs', async (req, res) => {
  try {
    const query = `
      SELECT 
        sj.JobID, sj.Date, sj.Status, v.RegistrationNo,
        c.FullName AS CustomerName, m.Name AS MechanicName
      FROM ServiceJob sj
      JOIN Vehicle v ON sj.VehicleID = v.VehicleID
      JOIN Customer c ON v.CustomerID = c.CustomerID
      LEFT JOIN Mechanic m ON sj.MechanicID = m.MechanicID
      ORDER BY sj.Date DESC
    `;
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (error) {
    console.error("Failed to fetch service jobs:", error);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// POST new service job
app.post('/api/jobs', async (req, res) => {
  try {
    const { VehicleID, MechanicID, Date, Notes } = req.body;
    const status = MechanicID ? 'Assigned' : 'Scheduled';
    const [result] = await db.query(
      'INSERT INTO ServiceJob (VehicleID, MechanicID, Date, Status, Notes) VALUES (?, ?, ?, ?, ?)',
      [VehicleID, MechanicID, Date, status, Notes]
    );
    res.status(201).json({ JobID: result.insertId, ...req.body, Status: status });
  } catch (error) {
    res.status(500).json({ error: 'Database insert failed' });
  }
});

// ✅ PUT: Update job status + generate invoice if Completed
app.put('/api/jobs/:id/status', async (req, res) => {
  const { id: jobId } = req.params;
  const { status: newStatus, laborCharges } = req.body;

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    if (newStatus === 'Completed') {
      await connection.query(
        'UPDATE ServiceJob SET LaborCharges = ? WHERE JobID = ?',
        [laborCharges, jobId]
      );

      const [parts] = await connection.query(
        `SELECT SUM(sp.Price * jp.QuantityUsed) AS totalPartsCost 
         FROM Job_Parts jp
         JOIN SparePart sp ON jp.PartID = sp.PartID
         WHERE jp.JobID = ?`,
        [jobId]
      );

      const totalPartsCost = parts[0].totalPartsCost || 0;
      const finalAmount = parseFloat(totalPartsCost) + parseFloat(laborCharges);

      await connection.query(
        'INSERT INTO Invoice (JobID, Amount, DateIssued, Status) VALUES (?, ?, CURDATE(), ?)',
        [jobId, finalAmount, 'Unpaid']
      );

      await connection.query(
        'UPDATE ServiceJob SET Status = ? WHERE JobID = ?',
        ['Invoiced', jobId]
      );

      await connection.commit();
      res.json({ message: `Invoice generated successfully for ₹${finalAmount}` });

    } else {
      await connection.query(
        'UPDATE ServiceJob SET Status = ? WHERE JobID = ?',
        [newStatus, jobId]
      );
      await connection.commit();
      res.json({ message: `Job status updated to ${newStatus}` });
    }

  } catch (error) {
    await connection.rollback();
    console.error("Error during job status update:", error);
    res.status(500).json({ error: 'Database transaction failed' });
  } finally {
    connection.release();
  }
});

// ====================================================
// ==================== INVOICE API ===================
// ====================================================

app.get('/api/invoices', async (req, res) => {
  try {
    const query = `
      SELECT 
        i.InvoiceID, i.DateIssued, i.Amount, i.Status, sj.JobID, c.FullName AS CustomerName
      FROM Invoice i
      JOIN ServiceJob sj ON i.JobID = sj.JobID
      JOIN Vehicle v ON sj.VehicleID = v.VehicleID
      JOIN Customer c ON v.CustomerID = c.CustomerID
      ORDER BY i.DateIssued DESC
    `;
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Database query failed' });
  }
});

// PUT: Update invoice status
app.put('/api/invoices/:id/status', async (req, res) => {
  const { id: invoiceId } = req.params;
  const { status: newStatus } = req.body;

  if (!['Paid','Unpaid'].includes(newStatus)) {
    return res.status(400).json({ error: 'Invalid status provided.' });
  }

  try {
    await db.query('UPDATE Invoice SET Status = ? WHERE InvoiceID = ?', [newStatus, invoiceId]);
    res.json({ message: `Invoice status updated to ${newStatus}` });
  } catch (error) {
    res.status(500).json({ error: 'Database update failed' });
  }
});

// ====================================================
// ================== JOB PARTS API ===================
// ====================================================

// GET parts for specific job
app.get('/api/jobs/:id/parts', async (req, res) => {
  const { id: jobId } = req.params;
  try {
    const query = `
      SELECT jp.JobPartID, sp.Name, sp.Price, jp.QuantityUsed
      FROM Job_Parts jp
      JOIN SparePart sp ON jp.PartID = sp.PartID
      WHERE jp.JobID = ?
    `;
    const [parts] = await db.query(query, [jobId]);
    res.json(parts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch parts for the job' });
  }
});

// POST: Add part to job & update stock
app.post('/api/jobs/:id/parts', async (req, res) => {
  const { id: jobId } = req.params;
  const { partId, quantity } = req.body;

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // Check stock
    const [stockCheck] = await connection.query('SELECT Stock FROM SparePart WHERE PartID = ?', [partId]);
    if (!stockCheck.length || stockCheck[0].Stock < quantity) {
      await connection.rollback();
      return res.status(400).json({ error: 'Insufficient stock for this part.' });
    }

    // Insert into Job_Parts
    await connection.query(
      'INSERT INTO Job_Parts (JobID, PartID, QuantityUsed) VALUES (?, ?, ?)',
      [jobId, partId, quantity]
    );

    // Update SparePart stock
    await connection.query(
      'UPDATE SparePart SET Stock = Stock - ? WHERE PartID = ?',
      [quantity, partId]
    );

    await connection.commit();
    res.status(201).json({ message: 'Part added to job successfully' });

  } catch (error) {
    await connection.rollback();
    res.status(500).json({ error: 'Failed to add part to job' });
  } finally {
    connection.release();
  }
});

// DELETE part from job & restore stock
app.delete('/api/job-parts/:jobPartId', async (req, res) => {
  const { jobPartId } = req.params;

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // Get part ID and quantity
    const [partData] = await connection.query('SELECT PartID, QuantityUsed FROM Job_Parts WHERE JobPartID = ?', [jobPartId]);
    if (!partData.length) {
      await connection.rollback();
      return res.status(404).json({ error: 'Job part not found' });
    }
    const { PartID, QuantityUsed } = partData[0];

    // Delete Job_Parts row
    await connection.query('DELETE FROM Job_Parts WHERE JobPartID = ?', [jobPartId]);

    // Restore stock
    await connection.query('UPDATE SparePart SET Stock = Stock + ? WHERE PartID = ?', [QuantityUsed, PartID]);

    await connection.commit();
    res.json({ message: 'Part removed from job successfully' });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ error: 'Failed to remove part from job' });
  } finally {
    connection.release();
  }
});

// ====================================================
// ==================== START SERVER ==================
// ====================================================

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
