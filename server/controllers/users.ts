import { Request, Response } from 'express';

import { User } from '../models/User';
import pool from '../db';

export async function registerUser(req: Request, res: Response) {
  try {
    const body = req.body;
    const newUser = await pool.query<User>(
      'INSERT INTO users (username,email,password) VALUES ($1,$2,$3) RETURNING *',
      [body.username, body.email, body.password]
    );
    res.json(newUser.rows[0]);
  } catch (err) {
    console.log(err);
  }
}
