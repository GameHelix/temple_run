// src/lib/db.ts
import { Pool } from 'pg';

// Create a new pool instance using DATABASE_URL connection string
// Neon URL already includes SSL settings in the connection string
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
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