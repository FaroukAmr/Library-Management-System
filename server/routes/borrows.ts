import {
  borrowBook,
  getAllBorrowedBooks,
  getBorrowedBookById,
  returnBook,
} from '../controllers/borrow';
import { borrowsValidation, returnValidation } from '../validators/borrows';

import express from 'express';
import userAuth from '../middleware/auth';
import validate from '../middleware/validations';

const router = express.Router();

router.get('/:id', userAuth, validate, getBorrowedBookById);
router.get('/', userAuth, validate, getAllBorrowedBooks);

router.post('/', userAuth, borrowsValidation, validate, borrowBook);

router.patch('/', userAuth, returnValidation, validate, returnBook);

export default router;
