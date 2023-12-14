import { Pool } from 'pg';
import config from './constants/index';
import fs from 'fs';
import path from 'path';

async function createDatabaseAndTables() {
  const adminPool = new Pool({
    user: config.DB_USER,
    host: config.DB_HOST,
    password: config.DB_PASSWORD,
    port: Number(config.DB_PORT),
  });

  const res = await adminPool.query(
    'SELECT 1 FROM pg_database WHERE datname = $1',
    [config.DB_DATABASE_NAME]
  );

  if (res.rowCount === 0) {
    await adminPool.query(`CREATE DATABASE ${config.DB_DATABASE_NAME}`);
    console.log(`Database ${config.DB_DATABASE_NAME} created.`);
  } else {
    console.log(`Database ${config.DB_DATABASE_NAME} already exists.`);
  }

  await adminPool.end();

  const pool = new Pool({
    user: config.DB_USER,
    host: config.DB_HOST,
    password: config.DB_PASSWORD,
    port: Number(config.DB_PORT),
    database: config.DB_DATABASE_NAME,
  });

  const sqlFilePath = path.join(__dirname, 'database.sql');
  const sql = fs.readFileSync(sqlFilePath, 'utf8');

  try {
    await pool.query(sql);
    console.log('Tables created.');
  } finally {
    await pool.end();
  }
}

createDatabaseAndTables().catch(console.error);
