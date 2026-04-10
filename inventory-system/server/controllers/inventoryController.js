const pool = require('../config/db');

// ================= GET ALL ITEMS =================
exports.getItems = async (req, res) => {
  try {
    const {
      status,
      q,
      inventory_number,
      assigned_to,
      category,
      office,
      location,
    } = req.query;

    const conditions = [];
    const values = [];

    if (status && status !== 'all') {
      values.push(status);
      conditions.push(`status = $${values.length}`);
    }

    if (q) {
      values.push(`%${q}%`);
      conditions.push(`
        (
          asset_id ILIKE $${values.length} OR
          inventory_number ILIKE $${values.length} OR
          name ILIKE $${values.length} OR
          brand ILIKE $${values.length} OR
          model ILIKE $${values.length} OR
          category ILIKE $${values.length} OR
          office ILIKE $${values.length} OR
          location ILIKE $${values.length} OR
          assigned_to ILIKE $${values.length}
        )
      `);
    }

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

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const { rows } = await pool.query(
      `SELECT * FROM inventory_items ${whereClause} ORDER BY id DESC`
    );

    res.json({ data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
};

// ================= GET ONE =================
exports.getItemById = async (req, res) => {
  try {
    const id = Number(req.params.itemId);

    const { rows } = await pool.query(
      `SELECT * FROM inventory_items WHERE id = $1`,
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json({ data: rows[0] });
  } catch (error) {
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
      notes,
    } = req.body;

    if (!name || !inventory_number) {
      return res.status(400).json({ error: 'Name and Inventory Number required' });
    }

    const { rows } = await pool.query(
      `INSERT INTO inventory_items
      (asset_id, inventory_number, name, brand, model, category, office, location, floor, status, notes)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'available',$10)
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
        notes || null,
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
    const id = Number(req.params.itemId);

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
      notes,
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
        id,
      ]
    );

    res.json({ data: rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update item' });
  }
};

// ================= DELETE =================
exports.deleteItem = async (req, res) => {
  try {
    const id = Number(req.params.itemId);

    await pool.query(`DELETE FROM inventory_items WHERE id = $1`, [id]);

    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete item' });
  }
};

// ================= ASSIGN =================
exports.assignItem = async (req, res) => {
  try {
    const { itemId, employeeName } = req.body;

    const { rows } = await pool.query(
      `UPDATE inventory_items
       SET assigned_to = $1, status = 'assigned'
       WHERE id = $2
       RETURNING *`,
      [employeeName, itemId]
    );

    res.json({ data: rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to assign item' });
  }
};

// ================= RETURN =================
exports.returnItem = async (req, res) => {
  try {
    const { itemId } = req.body;

    const { rows } = await pool.query(
      `UPDATE inventory_items
       SET assigned_to = NULL, status = 'available'
       WHERE id = $1
       RETURNING *`,
      [itemId]
    );

    res.json({ data: rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to return item' });
  }
};

// ================= HISTORY =================
exports.getItemHistory = async (req, res) => {
  try {
    const id = Number(req.params.itemId);

    const { rows } = await pool.query(
      `SELECT * FROM inventory_history WHERE item_id = $1 ORDER BY created_at DESC`,
      [id]
    );

    res.json({ data: rows });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
};
