import { Request, Response } from 'express';

import { User } from '../models/User';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import pool from '../db';

dotenv.config();

export async function registerUser(req: Request, res: Response) {
  try {
    const body = req.body;
    const newUser = await pool.query<User>(
      'INSERT INTO users (name,email,password,registered) VALUES ($1,$2,$3,$4) RETURNING *',
      [body.name, body.email, body.password, body.registered]
    );
    res.json(newUser.rows[0]);
  } catch (err) {
    console.log(err);
  }
}
