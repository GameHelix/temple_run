// scripts/update-users-to-patients.ts
const dotenv = require('dotenv');
dotenv.config();
const { Pool } = require('pg');

console.log('Update Existing Users Script');
console.log('---------------------------');
console.log('Environment variables loaded');

// Create a database connection with SSL disabled
const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  // Disable SSL for local development
  ssl: false
});

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

// Function to update existing users
async function updateExistingUsers() {
  try {
    console.log('Checking for users without a role...');
    
    // First, check if there are users without a role
    const checkResult = await query(`
      SELECT COUNT(*) as count 
      FROM users 
      WHERE role IS NULL OR role = ''
    `);
    
    const usersToUpdate = parseInt(checkResult.rows[0].count);
    
    if (usersToUpdate === 0) {
      console.log('No users found without a role. All users are already updated.');
    } else {
      console.log(`Found ${usersToUpdate} users without a role. Updating them to 'patient'...`);
      
      // Update users without a role to be patients
      const updateResult = await query(`
        UPDATE users 
        SET role = 'patient' 
        WHERE role IS NULL OR role = ''
      `);
      
      console.log(`Successfully updated ${updateResult.rowCount} users to have the 'patient' role.`);
    }
    
    // Now check the distribution of user roles
    const distributionResult = await query(`
      SELECT role, COUNT(*) as count 
      FROM users 
      GROUP BY role
    `);
    
    console.log('Current user role distribution:');
    distributionResult.rows.forEach((row) => {
      console.log(`- ${row.role}: ${row.count} users`);
    });
    
  } catch (err) {
    console.error('Error updating existing users:', err);
    throw err;
  } finally {
    // End the pool
    await pool.end();
  }
}

// Run the update
updateExistingUsers()
  .then(() => {
    console.log('User update complete.');
    process.exit(0);
  })
  .catch(error => {
    console.error('Failed to update users:', error);
    process.exit(1);
  });