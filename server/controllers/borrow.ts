import { Request, Response } from 'express';

import { Borrow } from '../models/Borrow';
import { User } from '../models/User';
import pool from '../db';

export async function getAllBorrowedBooks(req: Request, res: Response) {
  const user: User = req.user! as User;
  try {
    const allBorrows = await pool.query(
      `
      SELECT b.isbn, b.title, b.author, b.quantity, b.shelf, bb.borrowed_date, bb.expected_return_date 
      FROM borrowed_books bb
      JOIN books b ON bb.isbn = b.isbn
      WHERE bb.username = $1 AND bb.returned = false
    `,
      [user.username]
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
    const { isbn } = req.body;
    const user: User = req.user! as User;

    await pool.query('BEGIN');

    const newBorrow = await pool.query<Borrow>(
      'INSERT INTO borrowed_books (username,isbn) VALUES ($1,$2) RETURNING *',
      [user.username, isbn]
    );

    await pool.query(
      'UPDATE books SET quantity = quantity - 1 WHERE isbn = $1',
      [isbn]
    );

    await pool.query('COMMIT');
    res.json(newBorrow.rows[0]);
  } catch (err: any) {
    await pool.query('ROLLBACK');
    console.log(err);
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
      'UPDATE borrowed_books SET returned = true, actual_returned_date = CURRENT_TIMESTAMP WHERE username = $1 AND isbn = $2',
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
