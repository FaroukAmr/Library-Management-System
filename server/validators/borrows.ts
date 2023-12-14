import { User } from '../models/User';
import { check } from 'express-validator';
import db from '../database/db';

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

const borrowedThisBook = check('isbn').custom(async (isbn, { req }) => {
  const user: User = req.user! as User;
  const { rows } = await db.query(
    'SELECT * from borrowed_books WHERE isbn = $1 AND username = $2 AND returned = false',
    [isbn, user.username]
  );

  if (!rows.length) {
    throw new Error('You have not borrowed this book.');
  }
});

export const borrowsValidation = [bookAvailable, alreadyBorrowed];

export const returnValidation = [borrowedThisBook];
