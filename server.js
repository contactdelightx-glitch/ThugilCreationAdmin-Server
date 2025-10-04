const express = require("express");
const cors = require("cors");

// Routes
const loginRoute = require("./routes/auth/login");
const designsRoute = require("./routes/designs/designs");

// Swagger
const swaggerUi = require("swagger-ui-express");
const authPaths = require("./swagger/auth");
const designsPaths = require("./swagger/designs");

const app = express();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "https://thugilcreation-admin.netlify.app"],
    credentials: true,
  })
);
app.use(express.json());

// Combine Swagger paths
const swaggerDocument = {
  openapi: "3.0.0",
  info: { title: "Thugil Creation Admin", version: "1.0.0" },
  tags: [
    { name: "Auth", description: "Authentication endpoints" },
    { name: "Designs", description: "Designs management endpoints" },
  ],
  paths: {
    ...authPaths,
    ...designsPaths,
  },
};

// Swagger UI setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
console.log("✅ Swagger docs available at /api-docs");

// Routes
app.use("/auth", loginRoute);
app.use("/designs", designsRoute);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Server error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
