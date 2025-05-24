/**
 * Database Configuration for Hayloft Woodshed API
 * This file establishes and exports a PostgreSQL client pool.
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Create a PostgreSQL connection pool
const pool = new Pool({
  user: process.env.PGUSER || 'postgres',
  host: process.env.PGHOST || 'localhost',  // Container name is postgres-db, but accessed via localhost since port is mapped
  database: process.env.PGDATABASE || 'hayloft_woodshed', // Our application database
  password: process.env.PGPASSWORD || 'mysecretpassword', // Password from container setup
  port: process.env.PGPORT || 5432,
});

// Initialize the database schema if tables don't exist
const initializeSchema = async () => {
  try {
    // Check if products table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'products'
      );
    `);

    if (!tableCheck.rows[0].exists) {
      console.log('Products table not found. Initializing database schema...');
      
      // Read and execute the SQL initialization script
      const sqlPath = path.join(__dirname, 'init.sql');
      const sql = fs.readFileSync(sqlPath, 'utf8');
      
      await pool.query(sql);
      console.log('Database schema initialized successfully.');
    }
  } catch (err) {
    console.error('Error initializing database schema:', err);
  }
};

// Test the database connection and initialize schema
pool.query('SELECT NOW()', async (err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected successfully');
    await initializeSchema();
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
