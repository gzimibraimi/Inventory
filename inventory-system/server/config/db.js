const { Pool } = require('pg');

const poolConfig = process.env.PGUSER
  ? {
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      host: process.env.PGHOST,
      port: process.env.PGPORT,
      database: process.env.PGDATABASE,
    }
  : {
      connectionString: process.env.DATABASE_URL,
    };

const pool = new Pool(poolConfig);

module.exports = pool;
