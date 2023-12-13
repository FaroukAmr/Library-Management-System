import { check } from 'express-validator';
import { compare } from 'bcrypt';
import db from '../db';

const password = check('password')
  .isLength({ min: 8 })
  .withMessage('Password must be at least 8 chars long')
  .matches(/\d/)
  .withMessage('Password must contain a number');

const emailExists = check('email').custom(async (value) => {
  const { rows } = await db.query('SELECT * from users WHERE email = $1', [
    value,
  ]);

  if (rows.length) {
    throw new Error('Email already exists.');
  }
});

const email = check('email')
  .isEmail()
  .withMessage('Password must be a valid email');

const loginFieldsCheck = check('email').custom(async (email, { req }) => {
  const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  if (!user.rows.length) {
    throw new Error('Email does not exist');
  }
  const valid = await compare(req.body.password, user.rows[0].password);
  if (!valid) {
    throw new Error('Incorrect password');
  }
  req.user = user.rows[0];
});

export const registerValidation = [email, password, emailExists];
export const loginValidation = [loginFieldsCheck];
