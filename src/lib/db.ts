// src/lib/db.ts
import { Pool } from 'pg';

// Create a new pool instance using environment variables with SSL enabled for Neon
const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: true // Always enable SSL for Neon database
});

// Helper function to get a client from the pool
export const getClient = async () => {
  const client = await pool.connect();
  return client;
};

// Helper function to execute SQL queries
export const query = async (text: string, params?: unknown[]) => {
  const client = await pool.connect();
  try {
    return await client.query(text, params);
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Function to test the database connection
export const testConnection = async () => {
  try {
    const result = await query('SELECT NOW()');
    console.log('Database connection successful:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
};

export default pool;