require('dotenv').config();
const { Pool } = require('pg');

const connectionString = `postgresql://${process.env.DB_USER}:${encodeURIComponent(process.env.DB_PASSWORD)}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

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

module.exports = pool;
