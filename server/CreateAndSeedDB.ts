import { Pool } from 'pg';
import config from './constants/index';
import { faker } from '@faker-js/faker';
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
    seedDatabase().catch(console.error);
    console.log('Tables created.');
  } finally {
    await pool.end();
  }
}

async function seedDatabase() {
  const pool = new Pool({
    user: config.DB_USER,
    host: config.DB_HOST,
    password: config.DB_PASSWORD,
    port: Number(config.DB_PORT),
    database: config.DB_DATABASE_NAME,
  });

  try {
    for (let i = 0; i < 50; i++) {
      const fakeBook = {
        isbn: faker.string.numeric(13),
        title: faker.word.words({ count: { min: 2, max: 5 } }),
        author: faker.person.fullName(),
        quantity: faker.number.int(10),
        shelf: faker.string.alpha(1) + faker.string.numeric(1),
      };
      await pool.query(
        'INSERT INTO books (isbn, title, author, quantity, shelf) VALUES ($1, $2, $3, $4, $5)',
        [
          fakeBook.isbn,
          fakeBook.title,
          fakeBook.author,
          fakeBook.quantity,
          fakeBook.shelf,
        ]
      );
    }

    console.log('Fake books created.');
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

createDatabaseAndTables().catch(console.error);
