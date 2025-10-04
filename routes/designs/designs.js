const express = require("express");
const DesignsModel = require("../../models/designs");

const designs = express.Router();

// Create a new design
designs.post("/", async (req, res) => {
  try {
    const designData = req.body;
    const newDesign = await DesignsModel.createDesign(designData);
    res.json({
      message: "Design created successfully",
      design: newDesign,
    });
  } catch (error) {
    console.error("❌ Error creating design:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all designs with pagination and filtering
designs.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const skip = (page - 1) * limit;

    // Allowed filters from query
    const allowedFilters = [
      "id",
      "product_id",
      "email",
      "name",
      "saree_style",
      "jacquard_type",
      "label",
      "epi",
      "ppi",
      "hooks",
    ];
    const filters = {};

    allowedFilters.forEach((field) => {
      if (req.query[field] !== undefined) {
        filters[field] = req.query[field];
      }
    });

    const { designs: results, total } = await DesignsModel.getDesignsPaginated({
      skip,
      limit,
      filters,
    });

    res.json({
      page,
      limit,
      total,
      filters,
      designs: results,
    });
  } catch (error) {
    console.error("❌ Error fetching designs:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = designs;
