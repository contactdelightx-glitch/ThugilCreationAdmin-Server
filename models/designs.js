const pool = require("../db");

// Ensure designs table exists
const ensureDesignsTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS designs (
        id SERIAL PRIMARY KEY,
        product_id VARCHAR(255),
        cards JSONB,
        email VARCHAR(255),
        epi INT,
        final_price NUMERIC,
        harnessbuild TEXT,
        hooks INT,
        image_type JSONB,
        image_url JSONB,
        label VARCHAR(255),
        listing_rate NUMERIC,
        name VARCHAR(255),
        original_image_url TEXT,
        ppi INT,
        saree_style VARCHAR(100),
        redirect_url TEXT,
        body_epi INT,
        total_hooks INT,
        border_epi INT,
        jacquard_type VARCHAR(100),
        br_hooks INT,
        by_hooks INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Designs table ensured");
  } catch (err) {
    console.error("❌ Error ensuring designs table:", err.message);
    process.exit(1);
  }
};

ensureDesignsTable();

const createDesign = async (data) => {
  try {
    const result = await pool.query(
      `INSERT INTO designs (
        product_id, cards, email, epi, final_price, harnessbuild, hooks,
        image_type, image_url, label, listing_rate, name, original_image_url, ppi,
        saree_style, redirect_url, body_epi, total_hooks, border_epi,
        jacquard_type, br_hooks, by_hooks
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22
      ) RETURNING *`,
      [
        data.product_id,
        data.cards || [],
        data.email,
        data.epi,
        data.final_price,
        data.harnessbuild,
        data.hooks,
        data.image_type || [],
        data.image_url || [],
        data.label,
        data.listing_rate,
        data.name,
        data.original_image_url,
        data.ppi,
        data.saree_style,
        data.redirect_url,
        data.body_epi,
        data.total_hooks,
        data.border_epi,
        data.jacquard_type,
        data.br_hooks,
        data.by_hooks,
      ]
    );
    return result.rows[0];
  } catch (err) {
    console.error("❌ Error creating design:", err.message);
    throw err;
  }
};

const getDesignsPaginated = async ({ skip = 0, limit = 50, filters = {} }) => {
  try {
    const conditions = [];
    const values = [];
    let paramIndex = 1;

    Object.entries(filters).forEach(([key, value]) => {
      conditions.push(`${key} = $${paramIndex}`);
      values.push(value);
      paramIndex++;
    });

    const whereClause = conditions.length
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

    const totalResult = await pool.query(
      `SELECT COUNT(*) FROM designs ${whereClause}`,
      values
    );
    const total = parseInt(totalResult.rows[0].count, 10);

    const result = await pool.query(
      `SELECT * FROM designs ${whereClause} ORDER BY id DESC LIMIT $${paramIndex} OFFSET $${
        paramIndex + 1
      }`,
      [...values, limit, skip]
    );

    return { designs: result.rows, total };
  } catch (err) {
    console.error("❌ Error fetching paginated designs:", err.message);
    throw err;
  }
};

module.exports = { createDesign, getDesignsPaginated };
