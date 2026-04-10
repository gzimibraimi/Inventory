const pool = require('../config/db');
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
      conditions.push(resolveStatusCondition(status, values));
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
      `SELECT * FROM inventory_items ${whereClause}
       ORDER BY id ASC`
    );

    res.json({ data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
};

// ================= SUMMARY =================
exports.getSummary = async (req, res) => {
  try {
    const [totalResult, inactiveResult, activeResult, inactiveItemsResult] = await Promise.all([
      pool.query('SELECT COUNT(*)::int AS count FROM inventory_items'),
      pool.query(
        'SELECT COUNT(*)::int AS count FROM inventory_items WHERE status = ANY($1)',
        [INACTIVE_STATUSES]
      ),
      pool.query(
        'SELECT COUNT(*)::int AS count FROM inventory_items WHERE status = ANY($1)',
        [ACTIVE_STATUSES]
      ),
      pool.query(
        `SELECT * FROM inventory_items
         WHERE status = ANY($1)
         ORDER BY id ASC
         LIMIT 5`,
        [INACTIVE_STATUSES]
      )
    ]);

    res.json({
      data: {
        total: totalResult.rows[0]?.count || 0,
        available: inactiveResult.rows[0]?.count || 0,
        assigned: activeResult.rows[0]?.count || 0,
        availableItems: inactiveItemsResult.rows || []
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch summary' });
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
       SET assigned_to = $1, status = 'active'
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
       SET assigned_to = NULL, status = 'inactive'
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
