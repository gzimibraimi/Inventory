const pool = require('../config/db');

// ================= STATUS HELPERS =================
const ACTIVE_STATUSES = ['active', 'assigned'];
const INACTIVE_STATUSES = ['inactive', 'available'];

const resolveStatusCondition = (status, values) => {
  if (status === 'active') {
    values.push(ACTIVE_STATUSES);
    return `status = ANY($${values.length})`;
  }

  if (status === 'inactive') {
    values.push(INACTIVE_STATUSES);
    return `status = ANY($${values.length})`;
  }

  values.push(status);
  return `status = $${values.length}`;
};

// ================= GET ITEMS (SEARCH + FILTERS) =================
exports.getItems = async (req, res) => {
  try {
    const {
      status,
      q,
      inventory_number,
      assigned_to,
      category,
      office,
      location
    } = req.query;

    const conditions = [];
    const values = [];

    // STATUS FILTER
    if (status && status !== 'all') {
      conditions.push(resolveStatusCondition(status, values));
    }

    // GLOBAL SEARCH
    const safeQ = q?.trim();
    if (safeQ) {
      values.push(`%${safeQ}%`);
      const idx = values.length;

      conditions.push(`
        (
          asset_id ILIKE $${idx} OR
          inventory_number ILIKE $${idx} OR
          name ILIKE $${idx} OR
          brand ILIKE $${idx} OR
          model ILIKE $${idx} OR
          category ILIKE $${idx} OR
          office ILIKE $${idx} OR
          location ILIKE $${idx} OR
          assigned_to ILIKE $${idx}
        )
      `);
    }

    // FIELD FILTERS
    if (inventory_number) {
      values.push(`%${inventory_number}%`);
      conditions.push(`inventory_number ILIKE $${values.length}`);
    }

    if (assigned_to) {
      values.push(`%${assigned_to}%`);
      conditions.push(`assigned_to ILIKE $${values.length}`);
    }

    if (category) {
      values.push(`%${category}%`);
      conditions.push(`category ILIKE $${values.length}`);
    }

    if (office) {
      values.push(`%${office}%`);
      conditions.push(`office ILIKE $${values.length}`);
    }

    if (location) {
      values.push(`%${location}%`);
      conditions.push(`location ILIKE $${values.length}`);
    }

    const whereClause = conditions.length
      ? `WHERE ${conditions.join(' AND ')}`
      : '';

    const query = `
      SELECT *
      FROM inventory_items
      ${whereClause}
      ORDER BY id ASC
    `;

    const { rows } = await pool.query(query, values);

    res.json({ data: rows });
  } catch (error) {
    console.error('GET ITEMS ERROR:', error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
};

// ================= SUMMARY =================
exports.getSummary = async (req, res) => {
  try {
    const total = await pool.query(
      'SELECT COUNT(*)::int AS count FROM inventory_items'
    );

    const active = await pool.query(
      'SELECT COUNT(*)::int AS count FROM inventory_items WHERE status = ANY($1)',
      [ACTIVE_STATUSES]
    );

    const inactive = await pool.query(
      'SELECT COUNT(*)::int AS count FROM inventory_items WHERE status = ANY($1)',
      [INACTIVE_STATUSES]
    );

    res.json({
      data: {
        total: total.rows[0].count,
        assigned: active.rows[0].count,
        available: inactive.rows[0].count
      }
    });
  } catch (error) {
    console.error('SUMMARY ERROR:', error);
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
};

// ================= GET BY ID =================
exports.getItemById = async (req, res) => {
  try {
    const { itemId } = req.params;

    const { rows } = await pool.query(
      'SELECT * FROM inventory_items WHERE id = $1',
      [itemId]
    );

    if (!rows.length) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json({ data: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch item' });
  }
};

// ================= CREATE =================
exports.createItem = async (req, res) => {
  try {
    const {
      asset_id,
      inventory_number,
      name,
      brand,
      model,
      category,
      office,
      location,
      floor,
      notes
    } = req.body;

    if (!name || !inventory_number) {
      return res.status(400).json({
        error: 'Name and Inventory Number required'
      });
    }

    const { rows } = await pool.query(
      `INSERT INTO inventory_items
      (asset_id, inventory_number, name, brand, model, category, office, location, floor, status, notes)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'inactive',$10)
      RETURNING *`,
      [
        asset_id || null,
        inventory_number,
        name,
        brand || null,
        model || null,
        category || null,
        office || null,
        location || null,
        floor || null,
        notes || null
      ]
    );

    res.status(201).json({ data: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create item' });
  }
};

// ================= UPDATE =================
exports.updateItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const {
      asset_id,
      inventory_number,
      name,
      brand,
      model,
      category,
      office,
      location,
      floor,
      notes
    } = req.body;

    const { rows } = await pool.query(
      `UPDATE inventory_items SET
        asset_id=$1,
        inventory_number=$2,
        name=$3,
        brand=$4,
        model=$5,
        category=$6,
        office=$7,
        location=$8,
        floor=$9,
        notes=$10
      WHERE id=$11
      RETURNING *`,
      [
        asset_id,
        inventory_number,
        name,
        brand,
        model,
        category,
        office,
        location,
        floor,
        notes,
        itemId
      ]
    );

    res.json({ data: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update item' });
  }
};

// ================= DELETE =================
exports.deleteItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    await pool.query(
      'DELETE FROM inventory_items WHERE id = $1',
      [itemId]
    );

    res.json({ message: 'Item deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete item' });
  }
};
exports.getItemQrData = async (req, res) => {
  try {
    const { itemId } = req.params;

    const { rows } = await pool.query(
      `SELECT id, inventory_number, name FROM inventory_items WHERE id = $1`,
      [itemId]
    );

    if (!rows.length) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // QR payload (simple but stable)
    const qrData = {
      id: rows[0].id,
      code: rows[0].inventory_number
    };

    res.json({ data: qrData });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate QR data' });
  }
};