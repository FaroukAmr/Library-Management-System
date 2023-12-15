import { check } from 'express-validator';
import { compare } from 'bcrypt';
import db from '../database/db';

const isbn = check('isbn')
  .isLength({ min: 13, max: 13 })
  .withMessage('isbn must be 13 digits long')
  .custom(async (value) => {
    const { rows } = await db.query('SELECT * from books WHERE isbn = $1', [
      value,
    ]);

    if (rows.length) {
      throw new Error('isbn already exists.');
    }
  });

const title = check('title')
  .isLength({ min: 1 })
  .withMessage('Title is required');

const author = check('author')
  .isLength({ min: 1 })
  .withMessage('Author is required');

const quantity = check('quantity')
  .isInt({ min: 0 })
  .withMessage('Quantity must be a positive number');

const shelf = check('shelf')
  .isLength({ min: 1 })
  .withMessage('Shelf is required');

export const bookValidation = [isbn, title, author, quantity, shelf];

export const editBookValidation = [title, author, quantity, shelf];
