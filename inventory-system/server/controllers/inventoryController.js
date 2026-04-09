const pool = require('../config/db');
const XLSX = require('xlsx');
const PDFDocument = require('pdfkit');

const normalizeCell = (value) => {
  if (value === null || value === undefined) return '';
  return String(value).trim();
};

const normalizeRow = (raw) => ({
  asset_id:
    normalizeCell(raw.AssetID) ||
    normalizeCell(raw.asset_id) ||
    normalizeCell(raw.AssetId),
  inventory_number:
    normalizeCell(raw.InventoryNumber) ||
    normalizeCell(raw.inventory_number) ||
    normalizeCell(raw.InventoryNo) ||
    normalizeCell(raw['Inventory Number']),
  name:
    normalizeCell(raw.AssetName) ||
    normalizeCell(raw.Name) ||
    normalizeCell(raw.Asset) ||
    normalizeCell(raw.AssetType) ||
    normalizeCell(raw.InventoryNumber) ||
    normalizeCell(raw.AssetID) ||
    normalizeCell(raw.Model) ||
    normalizeCell(raw.Brand) ||
    normalizeCell(raw['Item Name']) ||
    normalizeCell(raw.item),
  asset_type:
    normalizeCell(raw.AssetType) ||
    normalizeCell(raw.asset_type) ||
    normalizeCell(raw.Type),
  brand:
    normalizeCell(raw.Brand) ||
    normalizeCell(raw.brand),
  model:
    normalizeCell(raw.Model) ||
    normalizeCell(raw.model),
  serial_number:
    normalizeCell(raw.serial_number) ||
    normalizeCell(raw.Serial) ||
    normalizeCell(raw['Serial Number']) ||
    normalizeCell(raw.serial),
  category:
    normalizeCell(raw.category) ||
    normalizeCell(raw.Category) ||
    normalizeCell(raw.AssetType) ||
    normalizeCell(raw.asset_type) ||
    normalizeCell(raw.kat) ||
    normalizeCell(raw['Category']),
  office:
    normalizeCell(raw.office) ||
    normalizeCell(raw.Office) ||
    normalizeCell(raw.zyre) ||
    normalizeCell(raw['Office']),
  location:
    normalizeCell(raw.location) ||
    normalizeCell(raw.Location) ||
    normalizeCell(raw.lokacion) ||
    normalizeCell(raw['Location']),
  floor:
    normalizeCell(raw.Floor) ||
    normalizeCell(raw.floor),
  status: (() => {
    const rawStatus = normalizeCell(raw.status) || normalizeCell(raw.Status);
    if (!rawStatus) return 'available';
    const normalized = rawStatus.toLowerCase();
    if (normalized === 'active') return 'available';
    if (normalized === 'inactive') return 'assigned';
    if (normalized === 'available') return 'available';
    if (normalized === 'assigned' || normalized === 'in use' || normalized === 'in-use') return 'assigned';
    return rawStatus;
  })(),
  assigned_to:
    normalizeCell(raw.EmployeeName) ||
    normalizeCell(raw.assigned_to) ||
    normalizeCell(raw.employee) ||
    normalizeCell(raw.Punetor) ||
    normalizeCell(raw.AssignedTo),
  employee_id:
    normalizeCell(raw.EmployeeID) ||
    normalizeCell(raw.employee_id) ||
    normalizeCell(raw.Employee) ||
    normalizeCell(raw['Employee ID']),
  notes:
    normalizeCell(raw.Notes) ||
    normalizeCell(raw.notes),
});

exports.getItems = async (req, res) => {
  try {
    const { status, inventory_number, assigned_to, category, office, location, floor, q } = req.query;
    const conditions = [];
    const values = [];

    if (status && status !== 'all') {
      values.push(status);
      conditions.push(`status = $${values.length}`);
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
    if (floor) {
      values.push(`%${floor}%`);
      conditions.push(`floor ILIKE $${values.length}`);
    }
    if (q) {
      values.push(`%${q}%`);
      conditions.push(
        `(asset_id ILIKE $${values.length} OR inventory_number ILIKE $${values.length} OR name ILIKE $${values.length} OR brand ILIKE $${values.length} OR model ILIKE $${values.length} OR category ILIKE $${values.length} OR office ILIKE $${values.length} OR location ILIKE $${values.length} OR assigned_to ILIKE $${values.length} OR employee_id ILIKE $${values.length} OR notes ILIKE $${values.length})`
      );
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const query = `SELECT * FROM inventory_items ${whereClause} ORDER BY id ASC`;
    const { rows } = await pool.query(query, values);
    res.json({ data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to read inventory items' });
  }
};

exports.getSummary = async (req, res) => {
  try {
    const summaryQuery = `
      SELECT
        COUNT(*)::INT AS total,
        COUNT(*) FILTER (WHERE status = 'available')::INT AS available,
        COUNT(*) FILTER (WHERE status = 'assigned')::INT AS assigned
      FROM inventory_items;
    `;
    const { rows: [summary] } = await pool.query(summaryQuery);

    const availableItems = await pool.query(
      `SELECT id, asset_id, inventory_number, name, brand, model, category, office, location, floor FROM inventory_items WHERE status = 'available' ORDER BY name LIMIT 20`
    );

    res.json({ data: { ...summary, availableItems: availableItems.rows } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to read inventory summary' });
  }
};

exports.importItems = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Excel file is required' });
    }

    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rawRows = XLSX.utils.sheet_to_json(sheet, { defval: '' });

    const results = [];
    const insertSql = `
      INSERT INTO inventory_items
        (asset_id, inventory_number, name, asset_type, brand, model, serial_number, category, office, location, floor, status, assigned_to, employee_id, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *
    `;
    const updateSql = `
      UPDATE inventory_items SET
        asset_id = $1,
        inventory_number = $2,
        name = $3,
        asset_type = $4,
        brand = $5,
        model = $6,
        serial_number = $7,
        category = $8,
        office = $9,
        location = $10,
        floor = $11,
        status = $12,
        assigned_to = $13,
        employee_id = $14,
        notes = $15
      WHERE id = $16
      RETURNING *
    `;
    const findExistingSql = `
      SELECT id FROM inventory_items
      WHERE (asset_id IS NOT NULL AND asset_id = $1)
         OR (inventory_number IS NOT NULL AND inventory_number = $2)
      LIMIT 1
    `;

    for (let index = 0; index < rawRows.length; index += 1) {
      const raw = rawRows[index];
      const row = normalizeRow(raw);
      const rowNumber = index + 2;

      if (!row.name) {
        results.push({ row: rowNumber, status: 'skipped', error: 'Emri i paisjes mungon' });
        continue;
      }

      try {
        let item = null;
        if (row.asset_id || row.inventory_number) {
          const existing = await pool.query(findExistingSql, [row.asset_id || null, row.inventory_number || null]);
          if (existing.rows.length) {
            const itemId = existing.rows[0].id;
            const values = [
              row.asset_id || null,
              row.inventory_number || null,
              row.name,
              row.asset_type || null,
              row.brand || null,
              row.model || null,
              row.serial_number || null,
              row.category || null,
              row.office || null,
              row.location || null,
              row.floor || null,
              row.status || 'available',
              row.assigned_to || null,
              row.employee_id || null,
              row.notes || null,
              itemId,
            ];
            const { rows } = await pool.query(updateSql, values);
            item = rows[0];
            results.push({ row: rowNumber, status: 'updated' });
          }
        }

        if (!item) {
          const values = [
            row.asset_id || null,
            row.inventory_number || null,
            row.name,
            row.asset_type || null,
            row.brand || null,
            row.model || null,
            row.serial_number || null,
            row.category || null,
            row.office || null,
            row.location || null,
            row.floor || null,
            row.status || 'available',
            row.assigned_to || null,
            row.employee_id || null,
            row.notes || null,
          ];
          const { rows } = await pool.query(insertSql, values);
          item = rows[0];
          results.push({ row: rowNumber, status: 'inserted' });
        }
      } catch (rowError) {
        console.error(`Import row ${rowNumber} failed:`, rowError);
        results.push({ row: rowNumber, status: 'failed', error: rowError.message });
      }
    }

    const insertedCount = results.filter((r) => r.status === 'inserted').length;
    const updatedCount = results.filter((r) => r.status === 'updated').length;
    const skippedCount = results.filter((r) => r.status === 'skipped').length;
    const failedRows = results.filter((r) => r.status === 'failed');

    res.status(201).json({
      count: insertedCount + updatedCount,
      inserted: insertedCount,
      updated: updatedCount,
      skipped: skippedCount,
      errors: failedRows,
      results,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to import inventory from Excel' });
  }
};

exports.assignItem = async (req, res) => {
  try {
    const { itemId, employeeName } = req.body;
    if (!itemId || !employeeName) {
      return res.status(400).json({ error: 'itemId and employeeName are required' });
    }

    const itemResult = await pool.query('SELECT * FROM inventory_items WHERE id = $1', [itemId]);
    const item = itemResult.rows[0];
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const action = item.assigned_to
      ? item.assigned_to.toLowerCase() === employeeName.toLowerCase()
        ? 'reassigned'
        : 'transferred'
      : 'assigned';

    const updateResult = await pool.query(
      'UPDATE inventory_items SET assigned_to = $1, status = $2 WHERE id = $3 RETURNING *',
      [employeeName, 'assigned', itemId]
    );

    await pool.query(
      `INSERT INTO inventory_history (item_id, action, from_employee, to_employee, note)
       VALUES ($1, $2, $3, $4, $5)`,
      [itemId, action, item.assigned_to || null, employeeName, `${action} by API`]
    );

    res.json({ data: updateResult.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to assign the item' });
  }
};

exports.returnItem = async (req, res) => {
  try {
    const { itemId } = req.body;
    if (!itemId) {
      return res.status(400).json({ error: 'itemId is required' });
    }

    const itemResult = await pool.query('SELECT * FROM inventory_items WHERE id = $1', [itemId]);
    const item = itemResult.rows[0];
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const updateResult = await pool.query(
      'UPDATE inventory_items SET assigned_to = NULL, status = $1 WHERE id = $2 RETURNING *',
      ['available', itemId]
    );

    await pool.query(
      `INSERT INTO inventory_history (item_id, action, from_employee, note)
       VALUES ($1, $2, $3, $4)`,
      [itemId, 'returned', item.assigned_to || null, 'Returned to stock']
    );

    res.json({ data: updateResult.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to return the item' });
  }
};

exports.getReversPdf = async (req, res) => {
  try {
    const itemId = Number(req.params.itemId);
    if (!itemId) {
      return res.status(400).json({ error: 'Invalid item ID' });
    }

    const itemResult = await pool.query('SELECT * FROM inventory_items WHERE id = $1', [itemId]);
    const item = itemResult.rows[0];
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Revers-${item.id}.pdf`);

    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    doc.pipe(res);

    doc.fontSize(20).text('Revers Dokument', { underline: true });
    doc.moveDown();

    doc.fontSize(12).text(`Data: ${new Date().toLocaleDateString()}`);
    doc.text(`Item ID: ${item.id}`);
    doc.text(`Asset ID: ${item.asset_id || '-'}`);
    doc.text(`Inventory Number: ${item.inventory_number || '-'}`);
    doc.text(`Emri i Paisjes: ${item.name}`);
    doc.text(`Asset Type: ${item.asset_type || '-'}`);
    doc.text(`Brand: ${item.brand || '-'}`);
    doc.text(`Model: ${item.model || '-'}`);
    doc.text(`Serial Number: ${item.serial_number || '-'}`);
    doc.text(`Kategoria: ${item.category || '-'}`);
    doc.text(`Zyra: ${item.office || '-'}`);
    doc.text(`Lokacioni: ${item.location || '-'}`);
    doc.text(`Floor: ${item.floor || '-'}`);
    doc.text(`Statusi: ${item.status}`);
    doc.text(`Punetori i caktuar: ${item.assigned_to || '-'}`);
    doc.text(`Employee ID: ${item.employee_id || '-'}`);
    doc.text(`Notes: ${item.notes || '-'}`);

    doc.moveDown();
    doc.text('Nenshkruar nga:', { continued: false });
    doc.moveDown(2);
    doc.text('__________________________');
    doc.text('Firma');

    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to generate Revers PDF' });
  }
};

exports.seedData = async (req, res) => {
  try {
    const seedItems = [
      {
        asset_id: 'AST001',
        inventory_number: 'INV001',
        name: 'Laptop HP ProBook',
        asset_type: 'Computer',
        brand: 'HP',
        model: 'ProBook 450',
        serial_number: 'HP-001-2024',
        category: 'IT Equipment',
        office: 'Prishtinë',
        location: 'Desk 1',
        floor: '2',
        status: 'available',
        assigned_to: null,
      },
      {
        asset_id: 'AST002',
        inventory_number: 'INV002',
        name: 'Monitor Dell UltraSharp',
        asset_type: 'Monitor',
        brand: 'Dell',
        model: 'U2723DE',
        serial_number: 'DELL-002-2024',
        category: 'IT Equipment',
        office: 'Prishtinë',
        location: 'Desk 1',
        floor: '2',
        status: 'assigned',
        assigned_to: 'Arton Krasniqi',
      },
      {
        asset_id: 'AST003',
        inventory_number: 'INV003',
        name: 'Tastiera Logitech',
        asset_type: 'Keyboard',
        brand: 'Logitech',
        model: 'K380',
        serial_number: 'LOG-003-2024',
        category: 'IT Equipment',
        office: 'Prishtinë',
        location: 'Desk 2',
        floor: '2',
        status: 'assigned',
        assigned_to: 'Blerta Kelmendi',
      },
      {
        asset_id: 'AST004',
        inventory_number: 'INV004',
        name: 'Mouse Logitech',
        asset_type: 'Mouse',
        brand: 'Logitech',
        model: 'MX Master 3',
        serial_number: 'LOG-004-2024',
        category: 'IT Equipment',
        office: 'Pejë',
        location: 'Desk 1',
        floor: '1',
        status: 'available',
        assigned_to: null,
      },
      {
        asset_id: 'AST005',
        inventory_number: 'INV005',
        name: 'Printer HP LaserJet',
        asset_type: 'Printer',
        brand: 'HP',
        model: 'M404n',
        serial_number: 'HP-005-2024',
        category: 'Office Equipment',
        office: 'Prishtinë',
        location: 'Server Room',
        floor: '1',
        status: 'available',
        assigned_to: null,
      },
      {
        asset_id: 'AST006',
        inventory_number: 'INV006',
        name: 'Skaner Canon',
        asset_type: 'Scanner',
        brand: 'Canon',
        model: 'imageRUNNER',
        serial_number: 'CAN-006-2024',
        category: 'Office Equipment',
        office: 'Gjakovë',
        location: 'Front Desk',
        floor: '1',
        status: 'assigned',
        assigned_to: 'Fiona Berisha',
      },
      {
        asset_id: 'AST007',
        inventory_number: 'INV007',
        name: 'Mikrofon Shure',
        asset_type: 'Microphone',
        brand: 'Shure',
        model: 'SM58',
        serial_number: 'SHU-007-2024',
        category: 'Audio Equipment',
        office: 'Prishtinë',
        location: 'Conference Room',
        floor: '3',
        status: 'available',
        assigned_to: null,
      },
      {
        asset_id: 'AST008',
        inventory_number: 'INV008',
        name: 'Projektor Epson',
        asset_type: 'Projector',
        brand: 'Epson',
        model: 'EB-2250U',
        serial_number: 'EPS-008-2024',
        category: 'Presentation Equipment',
        office: 'Prishtinë',
        location: 'Conference Room B',
        floor: '3',
        status: 'available',
        assigned_to: null,
      },
      {
        asset_id: 'AST009',
        inventory_number: 'INV009',
        name: 'Telefon Cisco',
        asset_type: 'Phone',
        brand: 'Cisco',
        model: 'IP Phone 7841',
        serial_number: 'CIS-009-2024',
        category: 'Communication',
        office: 'Prishtinë',
        location: 'Desk 3',
        floor: '2',
        status: 'assigned',
        assigned_to: 'Gent Visoka',
      },
      {
        asset_id: 'AST010',
        inventory_number: 'INV010',
        name: 'Tablet Apple iPad',
        asset_type: 'Tablet',
        brand: 'Apple',
        model: 'iPad Pro 12.9',
        serial_number: 'APP-010-2024',
        category: 'IT Equipment',
        office: 'Prizren',
        location: 'Meeting Room',
        floor: '1',
        status: 'available',
        assigned_to: null,
      },
    ];

    const insertSql = `
      INSERT INTO inventory_items
        (asset_id, inventory_number, name, asset_type, brand, model, serial_number, category, office, location, floor, status, assigned_to)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `;

    const insertedItems = [];
    for (const seedItem of seedItems) {
      try {
        const { rows } = await pool.query(insertSql, [
          seedItem.asset_id,
          seedItem.inventory_number,
          seedItem.name,
          seedItem.asset_type,
          seedItem.brand,
          seedItem.model,
          seedItem.serial_number,
          seedItem.category,
          seedItem.office,
          seedItem.location,
          seedItem.floor,
          seedItem.status,
          seedItem.assigned_to,
        ]);
        insertedItems.push(rows[0]);
      } catch (itemError) {
        console.error('Seed item insert error:', itemError);
      }
    }

    res.status(201).json({
      message: 'Seed data inserted successfully',
      count: insertedItems.length,
      items: insertedItems,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to seed data' });
  }
};

exports.createItem = async (req, res) => {
  try {
    const { asset_id, inventory_number, name, asset_type, brand, model, serial_number, category, office, location, floor, notes } = req.body;

    if (!name || !inventory_number) {
      return res.status(400).json({ error: 'Name and Inventory Number are required' });
    }

    const insertSql = `
      INSERT INTO inventory_items
        (asset_id, inventory_number, name, asset_type, brand, model, serial_number, category, office, location, floor, status, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `;

    const { rows } = await pool.query(insertSql, [
      asset_id || null,
      inventory_number,
      name,
      asset_type || null,
      brand || null,
      model || null,
      serial_number || null,
      category || null,
      office || null,
      location || null,
      floor || null,
      'available',
      notes || null,
    ]);

    const item = rows[0];

    await pool.query(
      `INSERT INTO inventory_history (item_id, action, note)
       VALUES ($1, $2, $3)`,
      [item.id, 'created', 'Item created by user']
    );

    res.status(201).json({ data: item });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to create item' });
  }
};

exports.getitemHistory = async (req, res) => {
  try {
    const itemId = Number(req.params.itemId);
    if (!itemId) {
      return res.status(400).json({ error: 'Invalid item ID' });
    }

    const { rows } = await pool.query(
      `SELECT * FROM inventory_history WHERE item_id = $1 ORDER BY created_at DESC`,
      [itemId]
    );

    res.json({ data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch item history' });
  }
};

exports.getItemById = async (req, res) => {
  try {
    const itemId = Number(req.params.itemId);
    if (!itemId) {
      return res.status(400).json({ error: 'Invalid item ID' });
    }

    const { rows } = await pool.query(
      `SELECT * FROM inventory_items WHERE id = $1`,
      [itemId]
    );

    if (!rows.length) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const history = await pool.query(
      `SELECT * FROM inventory_history WHERE item_id = $1 ORDER BY created_at DESC LIMIT 10`,
      [itemId]
    );

    res.json({ data: { ...rows[0], history: history.rows } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch item' });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const itemId = Number(req.params.itemId);
    if (!itemId) {
      return res.status(400).json({ error: 'Invalid item ID' });
    }

    const { asset_id, inventory_number, name, asset_type, brand, model, serial_number, category, office, location, floor, notes } = req.body;

    if (!name || !inventory_number) {
      return res.status(400).json({ error: 'Name and Inventory Number are required' });
    }

    const updateSql = `
      UPDATE inventory_items SET
        asset_id = $1,
        inventory_number = $2,
        name = $3,
        asset_type = $4,
        brand = $5,
        model = $6,
        serial_number = $7,
        category = $8,
        office = $9,
        location = $10,
        floor = $11,
        notes = $12
      WHERE id = $13
      RETURNING *
    `;

    const { rows } = await pool.query(updateSql, [
      asset_id || null,
      inventory_number,
      name,
      asset_type || null,
      brand || null,
      model || null,
      serial_number || null,
      category || null,
      office || null,
      location || null,
      floor || null,
      notes || null,
      itemId,
    ]);

    if (!rows.length) {
      return res.status(404).json({ error: 'Item not found' });
    }

    await pool.query(
      `INSERT INTO inventory_history (item_id, action, note)
       VALUES ($1, $2, $3)`,
      [itemId, 'updated', 'Item updated by user']
    );

    res.json({ data: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to update item' });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const itemId = Number(req.params.itemId);
    if (!itemId) {
      return res.status(400).json({ error: 'Invalid item ID' });
    }

    const { rows } = await pool.query(
      `DELETE FROM inventory_items WHERE id = $1 RETURNING *`,
      [itemId]
    );

    if (!rows.length) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json({ message: 'Item deleted successfully', data: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to delete item' });
  }
};

exports.exportItems = async (req, res) => {
  try {
    const { status, assigned_to, category, office, location, floor, q, format = 'excel' } = req.query;
    const conditions = [];
    const values = [];

    if (status && status !== 'all') {
      values.push(status);
      conditions.push(`status = $${values.length}`);
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
    if (floor) {
      values.push(`%${floor}%`);
      conditions.push(`floor ILIKE $${values.length}`);
    }
    if (q) {
      values.push(`%${q}%`);
      conditions.push(
        `(asset_id ILIKE $${values.length} OR inventory_number ILIKE $${values.length} OR name ILIKE $${values.length} OR brand ILIKE $${values.length} OR model ILIKE $${values.length} OR category ILIKE $${values.length} OR office ILIKE $${values.length} OR location ILIKE $${values.length} OR assigned_to ILIKE $${values.length} OR employee_id ILIKE $${values.length} OR notes ILIKE $${values.length})`
      );
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const query = `SELECT * FROM inventory_items ${whereClause} ORDER BY id ASC`;
    const { rows } = await pool.query(query, values);

    const exportData = rows.map(row => ({
      ID: row.id,
      AssetID: row.asset_id || '',
      InventoryNumber: row.inventory_number || '',
      Name: row.name,
      AssetType: row.asset_type || '',
      Brand: row.brand || '',
      Model: row.model || '',
      SerialNumber: row.serial_number || '',
      Category: row.category || '',
      Office: row.office || '',
      Location: row.location || '',
      Floor: row.floor || '',
      Status: row.status,
      AssignedTo: row.assigned_to || '',
      EmployeeID: row.employee_id || '',
      Notes: row.notes || '',
    }));

    if (format === 'csv') {
      // CSV export (existing functionality)
      const csvString = [
        Object.keys(exportData[0]).join(','),
        ...exportData.map(row => Object.values(row).map(val => `"${val}"`).join(','))
      ].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=inventory-export.csv');
      res.send(csvString);
    } else {
      // Excel export (new functionality)
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(exportData);

      // Set column widths for better readability
      const colWidths = [
        { wch: 5 },  // ID
        { wch: 15 }, // AssetID
        { wch: 20 }, // InventoryNumber
        { wch: 30 }, // Name
        { wch: 15 }, // AssetType
        { wch: 15 }, // Brand
        { wch: 20 }, // Model
        { wch: 20 }, // SerialNumber
        { wch: 15 }, // Category
        { wch: 15 }, // Office
        { wch: 20 }, // Location
        { wch: 10 }, // Floor
        { wch: 12 }, // Status
        { wch: 25 }, // AssignedTo
        { wch: 15 }, // EmployeeID
        { wch: 30 }, // Notes
      ];
      worksheet['!cols'] = colWidths;

      XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventory');

      // Generate Excel file buffer
      const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=inventory-export.xlsx');
      res.send(excelBuffer);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to export inventory items' });
  }
};
