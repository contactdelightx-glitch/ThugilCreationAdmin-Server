// db.js
require('dotenv').config();
const { Pool } = require('pg');

// Build the connection string safely, encoding password
const connectionString = process.env.DATABASE_URL || `postgresql://${process.env.DB_USER}:${encodeURIComponent(process.env.DB_PASSWORD)}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }, // required for Supabase / remote Postgres
});

// Test the connection immediately
(async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Database connected successfully. Thugil Creation Server Running');
    client.release();
  } catch (err) {
    console.error('❌ Failed to connect to the database.');
    console.error(err);
    process.exit(1);
  }
})();

// Export the pool for use in other modules
module.exports = pool;
