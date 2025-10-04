const pool = require("../db");
const bcrypt = require("bcryptjs");

// Ensure users & related tables exist
const ensureUsersTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      type VARCHAR(50) NOT NULL DEFAULT 'tenant',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log("✅ Users table ensured");
};

const ensurePermissionsTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS permissions (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log("✅ Permissions table ensured");
};

const ensureRolesTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS roles (
      id SERIAL PRIMARY KEY,
      name VARCHAR(50) UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log("✅ Roles table ensured");
};

const ensureRolePermissionsTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS role_permissions (
      id SERIAL PRIMARY KEY,
      role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
      permission_id INTEGER REFERENCES permissions(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(role_id, permission_id)
    )
  `);
  console.log("✅ Role-Permissions table ensured");
};

const ensureUserRolesTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS user_roles (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, role_id)
    )
  `);
  console.log("✅ User-Roles table ensured");
};

// Initialize all tables
const init = async () => {
  await ensureUsersTable();
  await ensurePermissionsTable();
  await ensureRolesTable();
  await ensureRolePermissionsTable();
  await ensureUserRolesTable();
};
init();

const User = {
  create: async (email, password, type = "tenant") => {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await pool.query(
        `INSERT INTO users (email, password, type) VALUES ($1, $2, $3) RETURNING id, email, type`,
        [email, hashedPassword, type]
      );
      return result.rows[0];
    } catch (err) {
      if (err.code === "23505")
        throw new Error("User with this email already exists");
      console.error("❌ Error creating user:", err.message);
      throw err;
    }
  },

  findByEmail: async (email) => {
    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]);
    return result.rows[0] || null;
  },

  verifyPassword: async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
  },
};

module.exports = User;
