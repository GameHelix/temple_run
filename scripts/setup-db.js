// scripts/setup-db.js
// Initializes the database schema for Randevu
require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL not found in .env file');
    console.error('   Copy .env.example to .env and fill in your database connection string.');
    process.exit(1);
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    console.log('🔌 Connecting to database...');
    const sql = fs.readFileSync(path.join(__dirname, 'scripts.sql'), 'utf8');

    console.log('📝 Running schema migration...');
    await pool.query(sql);

    console.log('✅ Database setup complete!');
    console.log('');
    console.log('Next steps:');
    console.log('  1. Sign in at /auth/signin with the default admin account (see docs/DATABASE.md)');
    console.log('  2. Change the admin password immediately');
    console.log('  3. Start the dev server: npm run dev');
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

setupDatabase();
