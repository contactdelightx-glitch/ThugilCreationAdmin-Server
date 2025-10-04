const pool = require("../db");
const bcrypt = require("bcryptjs");

// Ensure users table exists
const ensureUsersTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL DEFAULT 'tenant', -- superadmin, admin, tenant
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Users table ensured");
  } catch (err) {
    console.error("❌ Error creating users table:", err.message);
    process.exit(1);
  }
};

// Ensure permissions table exists
const ensurePermissionsTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS permissions (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Permissions table ensured");
  } catch (err) {
    console.error("❌ Error creating permissions table:", err.message);
    process.exit(1);
  }
};

// Ensure roles table exists
const ensureRolesTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS roles (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Roles table ensured");
  } catch (err) {
    console.error("❌ Error creating roles table:", err.message);
    process.exit(1);
  }
};

// Map roles to permissions
const ensureRolePermissionsTable = async () => {
  try {
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
  } catch (err) {
    console.error("❌ Error creating role_permissions table:", err.message);
    process.exit(1);
  }
};

// Map users to roles
const ensureUserRolesTable = async () => {
  try {
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
  } catch (err) {
    console.error("❌ Error creating user_roles table:", err.message);
    process.exit(1);
  }
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
    try {
      const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
        email,
      ]);
      return result.rows[0] || null;
    } catch (err) {
      console.error("❌ Error finding user by email:", err.message);
      throw err;
    }
  },

  verifyPassword: async (plainPassword, hashedPassword) => {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (err) {
      console.error("❌ Error verifying password:", err.message);
      throw err;
    }
  },
};

module.exports = User;
