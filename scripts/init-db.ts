// scripts/init-db.ts
require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

console.log('Database Initialization Script');
console.log('------------------------------');
console.log('Environment variables loaded');

// Create a database connection
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'healthcare_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  // Use SSL only in production
  ssl: process.env.NODE_ENV === 'production'
});

// Log connection details (without password)
console.log('Connecting to database:');
console.log(`- Host: ${process.env.DB_HOST || 'localhost'}`);
console.log(`- Port: ${process.env.DB_PORT || '5432'}`);
console.log(`- Database: ${process.env.DB_NAME || 'healthcare_db'}`);
console.log(`- User: ${process.env.DB_USER || 'postgres'}`);
console.log(`- SSL: ${process.env.NODE_ENV === 'production'}`);

// Function to execute SQL queries
async function query(text, params) {
  console.log('Executing query:', text.substring(0, 50) + '...');
  const client = await pool.connect();
  try {
    return await client.query(text, params);
  } finally {
    client.release();
  }
}

// Function to initialize the database
async function initDatabase() {
  try {
    console.log('Creating users table...');
    // Create users table with role field
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'patient' NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('Creating chat_history table...');
    // Create chat_history table for storing user conversations
    await query(`
      CREATE TABLE IF NOT EXISTS chat_history (
        id UUID PRIMARY KEY,
        user_id UUID REFERENCES users(id),
        message TEXT NOT NULL,
        role VARCHAR(50) NOT NULL,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_user
          FOREIGN KEY(user_id) 
          REFERENCES users(id)
          ON DELETE CASCADE
      );
    `);
    
    console.log('Updating existing users to have the patient role...');
    // Update existing users to have the 'patient' role
    await query(`
      UPDATE users
      SET role = 'patient'
      WHERE role IS NULL OR role = '';
    `);
    
    console.log('Database initialized successfully!');
  } catch (err) {
    console.error('Error initializing database:', err);
    throw err;
  } finally {
    // End the pool
    await pool.end();
  }
}

// Run the initialization
initDatabase()
  .then(() => {
    console.log('Database setup complete.');
    process.exit(0);
  })
  .catch(error => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  });