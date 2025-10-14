// Quick script to setup database
require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL not found in .env file');
    process.exit(1);
  }

  console.log('✅ DATABASE_URL loaded from .env');

  // Parse DATABASE_URL and use it directly
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL
  });

  try {
    console.log('🔌 Connecting to database...');
    const sql = fs.readFileSync(path.join(__dirname, 'scripts.sql'), 'utf8');

    console.log('📝 Executing SQL script...');
    await pool.query(sql);

    console.log('✅ Database setup completed successfully!');
    console.log('');
    console.log('Default admin account created:');
    console.log('  Email: admin@randevu.com');
    console.log('  Password: admin123');
    console.log('  (Change this password after first login!)');
    console.log('');
    console.log('Sample doctors created:');
    console.log('  - Dr. Sarah Johnson (Cardiology)');
    console.log('  - Dr. Michael Chen (Pediatrics)');

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

setupDatabase();
