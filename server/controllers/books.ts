import { NextFunction, Request, Response } from 'express';

import { Book } from '../models/Book';
import pool from '../db';

export async function getAllBooks(req: Request, res: Response) {
  try {
    const allBooks = await pool.query<Book>('SELECT * FROM books');
    res.json(allBooks.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function getBookById(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const book = await pool.query<Book>('SELECT * FROM books WHERE isbn = $1', [
      id,
    ]);
    res.json(book.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function createBook(req: Request, res: Response) {
  try {
    const body = req.body;
    const newBook = await pool.query<Book>(
      'INSERT INTO books (isbn,title,author,quantity,shelf) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [body.isbn, body.title, body.author, body.quantity, body.shelf]
    );
    res.json(newBook.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateBook(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const body = req.body;
    const updatedBook = await pool.query<Book>(
      'UPDATE books SET isbn = $1, title = $2, author = $3, quantity = $4, shelf = $5 WHERE isbn = $6 RETURNING *',
      [body.isbn, body.title, body.author, body.quantity, body.shelf, id]
    );
    res.json(updatedBook.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function deleteBook(req: Request, res: Response) {
  try {
    const id = req.params.id;
    await pool.query('DELETE FROM books WHERE isbn = $1', [id]);
    res.json('Book deleted');
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
