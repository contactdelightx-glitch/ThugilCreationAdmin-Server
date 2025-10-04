// db.js
require("dotenv").config();
const { Pool } = require("pg");

// Allow Node to ignore self-signed SSL certs globally
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

module.exports = pool;
