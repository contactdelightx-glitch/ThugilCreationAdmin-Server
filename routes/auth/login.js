const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const pool = require("../../db");

const Auth = express.Router();

Auth.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await User.findByEmail(email);
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    const permissionsResult = await pool.query(
      `
      SELECT p.permission
      FROM permissions p
      JOIN role_permissions rp ON p.id = rp.permission_id
      JOIN roles r ON rp.role_id = r.id
      JOIN user_roles ur ON r.id = ur.role_id
      WHERE ur.user_id = $1
      GROUP BY p.id, p.permission
      ORDER BY p.id
      `,
      [user.id]
    );

    const permissions = permissionsResult.rows.map((row) => row.permission);

    // Set permissions in a cookie (JSON stringified)
    res.cookie("permissions", JSON.stringify(permissions), {
      httpOnly: true, // Not accessible via JS (for security)
      secure: process.env.NODE_ENV === "production", // Only over HTTPS in production
      maxAge: 1000 * 60 * 60, // 1 hour
      sameSite: "strict", // Helps prevent CSRF
    });

    return res.json({
      token,
      user: { id: user.id, email: user.email },
      permissions,
      message: "Login successful",
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = Auth;
