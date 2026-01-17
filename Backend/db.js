// db.js
const mysql = require('mysql2');

// Create a connection pool for efficient connection management
const pool = mysql.createPool({
  host: 'localhost',         // Your database host
  user: 'root',              // Your MySQL username
  password: 'Atharva@123', // Your MySQL password
  database: 'vehicle_service_db', // The name of your database
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Export the promise-based connection pool
module.exports = pool.promise();