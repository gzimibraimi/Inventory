const pool = require('./db');

const initSql = `
CREATE TABLE IF NOT EXISTS inventory_items (
  id SERIAL PRIMARY KEY,
  asset_id TEXT,
  inventory_number TEXT,
  name TEXT NOT NULL,
  asset_type TEXT,
  brand TEXT,
  model TEXT,
  serial_number TEXT,
  category TEXT,
  office TEXT,
  location TEXT,
  floor TEXT,
  status TEXT NOT NULL DEFAULT 'available',
  assigned_to TEXT,
  employee_id TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS inventory_history (
  id SERIAL PRIMARY KEY,
  item_id INTEGER REFERENCES inventory_items(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  from_employee TEXT,
  to_employee TEXT,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
`;

async function initDb() {
  await pool.query(initSql);
}

module.exports = initDb;
