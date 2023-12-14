import { Pool } from 'pg';
import config from '../constants';

const pool = new Pool({
  user: config.DB_USER,
  host: config.DB_HOST,
  password: config.DB_PASSWORD,
  port: Number(config.DB_PORT),
  database: config.DB_DATABASE_NAME,
});

export default pool;
