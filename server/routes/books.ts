import {
  createBook,
  deleteBook,
  getAllBooks,
  getBookById,
  updateBook,
} from '../controllers/books';

import { bookValidation } from '../validators/books';
import express from 'express';
import userAuth from '../middleware/auth';
import validate from '../middleware/validations';

const router = express.Router();

router.post('/', userAuth, bookValidation, validate, createBook);
router.get('/', userAuth, validate, getAllBooks);
router.get('/:id', userAuth, validate, getBookById);
router.put('/:id', userAuth, validate, updateBook);
router.delete('/:id', userAuth, validate, deleteBook);

export default router;
