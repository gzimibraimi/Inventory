const crypto = require('crypto');
const pool = require('../config/db');

const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
};

const verifyPassword = (password, storedHash) => {
  const [salt, originalHash] = storedHash.split(':');

  if (!salt || !originalHash) {
    return false;
  }

  const derivedHash = crypto.scryptSync(password, salt, 64);
  const originalBuffer = Buffer.from(originalHash, 'hex');

  if (derivedHash.length !== originalBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(derivedHash, originalBuffer);
};

const sanitizeUser = (user) => ({
  id: user.id,
  username: user.username,
  full_name: user.full_name,
  role: user.role,
  created_at: user.created_at,
});

exports.register = async (req, res) => {
  try {
    const { username, password, fullName } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const normalizedUsername = username.trim().toLowerCase();

    if (normalizedUsername.length < 3) {
      return res.status(400).json({ error: 'Username must be at least 3 characters' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existingUser = await pool.query(
      'SELECT id FROM users WHERE username = $1',
      [normalizedUsername]
    );

    if (existingUser.rows.length) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    const passwordHash = hashPassword(password);
    const { rows } = await pool.query(
      `INSERT INTO users (username, password_hash, full_name)
       VALUES ($1, $2, $3)
       RETURNING id, username, full_name, role, created_at`,
      [normalizedUsername, passwordHash, fullName?.trim() || null]
    );

    return res.status(201).json({ data: sanitizeUser(rows[0]) });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to register user' });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const normalizedUsername = username.trim().toLowerCase();
    const { rows } = await pool.query(
      `SELECT id, username, password_hash, full_name, role, created_at
       FROM users
       WHERE username = $1`,
      [normalizedUsername]
    );

    if (!rows.length || !verifyPassword(password, rows[0].password_hash)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    return res.json({ data: sanitizeUser(rows[0]) });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to login' });
  }
};
