import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  password: 'farouk123',
  port: 5432,
  database: 'library',
});

export default pool;
