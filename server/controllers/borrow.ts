import { Request, Response } from 'express';

import { Borrow } from '../models/Borrow';
import pool from '../db';

export async function getAllBorrowedBooks(req: Request, res: Response) {
  try {
    const username = req.params.username;
    const allBorrows = await pool.query<Borrow>(
      `
      SELECT b.isbn, b.title, b.author, bb.borrowed_date 
      FROM borrowed_books bb
      JOIN books b ON bb.isbn = b.isbn
      WHERE bb.username = $1 AND bb.returned = false
    `,
      [username]
    );
    res.json(allBorrows.rows);
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}

export async function borrowBook(req: Request, res: Response) {
  try {
    const { username, isbn } = req.body;
    await pool.query('BEGIN');

    const newBorrow = await pool.query<Borrow>(
      'INSERT INTO borrowed_books (username,isbn) VALUES ($1,$2) RETURNING *',
      [username, isbn]
    );

    await pool.query(
      'UPDATE books SET quantity = quantity - 1 WHERE isbn = $1',
      [isbn]
    );

    await pool.query('COMMIT');
    res.json(newBorrow.rows[0]);
  } catch (err: any) {
    await pool.query('ROLLBACK');
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}

export async function returnBook(req: Request, res: Response) {
  try {
    const { username, isbn } = req.body;
    await pool.query('BEGIN');

    await pool.query(
      'UPDATE borrowed_books SET returned = true, returned_date = CURRENT_TIMESTAMP WHERE username = $1 AND isbn = $2',
      [username, isbn]
    );

    await pool.query(
      'UPDATE books SET quantity = quantity + 1 WHERE isbn = $1',
      [isbn]
    );

    await pool.query('COMMIT');
    res.status(200).json({
      success: true,
      message: `Book with ISBN ${isbn} returned`,
    });
  } catch (err: any) {
    await pool.query('ROLLBACK');
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}
