import { User } from '../models/User';
import { check } from 'express-validator';
import db from '../db';

const bookAvailable = check('isbn').custom(async (isbn) => {
  const { rows } = await db.query(
    'SELECT * from books WHERE isbn = $1 AND quantity > 0',
    [isbn]
  );

  if (!rows.length) {
    throw new Error('Book not available.');
  }
});

const alreadyBorrowed = check('isbn').custom(async (isbn, { req }) => {
  const user: User = req.user! as User;
  const { rows } = await db.query(
    'SELECT * from borrowed_books WHERE isbn = $1 AND username = $2 AND returned = false',
    [isbn, user.username]
  );

  if (rows.length) {
    throw new Error('Book already borrowed.');
  }
});

export const borrowsValidation = [bookAvailable, alreadyBorrowed];
