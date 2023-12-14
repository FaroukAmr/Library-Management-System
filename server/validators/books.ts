import { check } from 'express-validator';
import { compare } from 'bcrypt';
import db from '../db';

const ISBN = check('ISBN')
  .isLength({ min: 13, max: 13 })
  .withMessage('ISBN must 13 digits long')
  .custom(async (value) => {
    const { rows } = await db.query('SELECT * from books WHERE ISBN = $1', [
      value,
    ]);

    if (rows.length) {
      throw new Error('ISBN already exists.');
    }
  });

const title = check('title')
  .isLength({ min: 1 })
  .withMessage('Title is required');

const author = check('author')
  .isLength({ min: 1 })
  .withMessage('Author is required');

//check quantity is a number and positive
const quantity = check('quantity')
  .isInt({ min: 0 })
  .withMessage('Quantity must be a positive number');

const shelf = check('shelf')
  .isLength({ min: 1 })
  .withMessage('Shelf is required');

export const bookValidation = [ISBN, title, author, quantity, shelf];
