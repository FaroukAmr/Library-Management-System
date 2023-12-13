import { Request, Response } from 'express';

import { User } from '../models/User';
import { hash } from 'bcrypt';
import pool from '../db';

export async function registerUser(req: Request, res: Response) {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await hash(password, 10);
    const newUser = await pool.query<User>(
      'INSERT INTO users (username,email,password) VALUES ($1,$2,$3) RETURNING *',
      [username, email, hashedPassword]
    );
    res.json(newUser.rows[0]);
  } catch (err) {
    console.log(err);
  }
}
