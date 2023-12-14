import { Request, Response } from 'express';

import { User } from '../models/User';
import config from '../constants';
import { hash } from 'bcrypt';
import pool from '../db';
import { sign } from 'jsonwebtoken';

export async function registerUser(req: Request, res: Response) {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await hash(password, 10);
    await pool.query<User>(
      'INSERT INTO users (username,email,password) VALUES ($1,$2,$3) RETURNING *',
      [username, email, hashedPassword]
    );

    return res.status(201).json({
      success: true,
      message: 'User created successfully',
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

export async function loginUser(req: Request, res: Response) {
  try {
    const user: User = (req as any).user as User;
    const payload = {
      username: user.username,
      email: user.email,
    };
    const token = sign(payload, config.SECRET!);
    return res.status(200).cookie('token', token, { httpOnly: true }).json({
      success: true,
      message: 'User logged in successfully',
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

export async function logoutUser(req: Request, res: Response) {
  try {
    return res.status(200).clearCookie('token').json({
      success: true,
      message: 'User logged out successfully',
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

export async function checkAuthentication(req: Request, res: Response) {
  try {
    const user: User = (req as any).user as User;
    return res.status(200).json({
      success: true,
      message: 'User authenticated',
      isAuthenticated: true,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
      data: {
        isAuthenticated: false,
      },
    });
  }
}
