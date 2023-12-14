import { Request, Response } from 'express';

import { Borrow } from '../models/Borrow';
import { User } from '../models/User';
import pool from '../database/db';

export async function getAllBorrowedBooks(req: Request, res: Response) {
  const user: User = req.user! as User;
  try {
    const allBorrows = await pool.query(
      `
      SELECT b.isbn, b.title, b.author, b.quantity, b.shelf, bb.borrowed_date, bb.expected_return_date 
      FROM borrowed_books bb
      JOIN books b ON bb.isbn = b.isbn
      WHERE bb.username = $1 AND bb.returned = false
      ORDER BY bb.borrowed_date DESC, b.title ASC
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

export async function getBorrowedBookById(req: Request, res: Response) {
  const user: User = req.user! as User;
  const { id } = req.params;
  try {
    const borrowedBook = await pool.query(
      `
      SELECT b.isbn, b.title, b.author, b.quantity, b.shelf, bb.borrowed_date, bb.expected_return_date 
      FROM borrowed_books bb
      JOIN books b ON bb.isbn = b.isbn
      WHERE bb.username = $1 AND bb.isbn = $2 AND bb.returned = false
    `,
      [user.username, id]
    );
    res.json(borrowedBook.rows[0]);
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}

export async function getAllBookBorrowers(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const allBorrowers = await pool.query(
      `
      SELECT u.username, u.email, bb.borrowed_date, bb.expected_return_date 
      FROM borrowed_books bb
      JOIN users u ON bb.username = u.username
      WHERE bb.isbn = $1 AND bb.returned = false
      ORDER BY bb.borrowed_date DESC, u.username ASC
    `,
      [id]
    );
    res.json(allBorrowers.rows);
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
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}

export async function returnBook(req: Request, res: Response) {
  try {
    const { isbn } = req.body;
    const user: User = req.user! as User;
    await pool.query('BEGIN');

    await pool.query(
      'UPDATE borrowed_books SET returned = true, actual_return_date = CURRENT_TIMESTAMP WHERE username = $1 AND isbn = $2',
      [user.username, isbn]
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
