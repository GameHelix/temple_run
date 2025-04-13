// scripts/test-user-creation.ts
require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

console.log('Test User Creation Script');
console.log('-------------------------');
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

// Function to create test users
async function createTestUsers() {
  try {
    // Hash the password (using the same password 'password123' for all test users)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    const now = new Date();
    
    // Create test doctor user
    const doctorId = uuidv4();
    const doctorEmail = `doctor_${Date.now()}@example.com`;
    
    console.log('Creating test doctor user with email:', doctorEmail);
    
    await query(
      `INSERT INTO users (id, name, email, password, role, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       ON CONFLICT (email) DO NOTHING`,
      [
        doctorId,
        'Test Doctor',
        doctorEmail,
        hashedPassword,
        'doctor',
        now,
        now
      ]
    );
    
    // Create test patient user
    const patientId = uuidv4();
    const patientEmail = `patient_${Date.now()}@example.com`;
    
    console.log('Creating test patient user with email:', patientEmail);
    
    await query(
      `INSERT INTO users (id, name, email, password, role, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       ON CONFLICT (email) DO NOTHING`,
      [
        patientId,
        'Test Patient',
        patientEmail,
        hashedPassword,
        'patient',
        now,
        now
      ]
    );
    
    // List created users
    console.log('\nCreated the following test users:');
    console.log(`- Doctor: ${doctorEmail} (password: password123)`);
    console.log(`- Patient: ${patientEmail} (password: password123)`);
    
    // Check total user counts by role
    const roleDistribution = await query(`
      SELECT role, COUNT(*) as count 
      FROM users 
      GROUP BY role
    `);
    
    console.log('\nCurrent user role distribution:');
    roleDistribution.rows.forEach((row) => {
      console.log(`- ${row.role}: ${row.count} users`);
    });
    
  } catch (err) {
    console.error('Error creating test users:', err);
    throw err;
  } finally {
    // End the pool
    await pool.end();
  }
}

// Run the function
createTestUsers()
  .then(() => {
    console.log('\nTest user creation complete.');
    process.exit(0);
  })
  .catch(error => {
    console.error('Failed to create test users:', error);
    process.exit(1);
  });