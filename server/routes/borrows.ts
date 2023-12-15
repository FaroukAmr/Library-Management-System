import {
  borrowBook,
  exportAllBorrowsOfLastMonth,
  exportOverdueBorrowsOfLastMonth,
  getAllBookBorrowers,
  getAllBorrowedBooks,
  getBorrowedBookById,
  returnBook,
} from '../controllers/borrow';
import { borrowsValidation, returnValidation } from '../validators/borrows';

import express from 'express';
import { limiter } from '../index';
import userAuth from '../middleware/auth';
import validate from '../middleware/validations';

const router = express.Router();

router.get('/:id', userAuth, validate, getBorrowedBookById);
router.get('/', userAuth, validate, getAllBorrowedBooks);
router.post('/', userAuth, borrowsValidation, validate, borrowBook);
router.post('/:id', userAuth, validate, getAllBookBorrowers);
router.get('/export/all', userAuth, exportAllBorrowsOfLastMonth);
router.get('/export/overdue', userAuth, exportOverdueBorrowsOfLastMonth);
router.patch('/', userAuth, returnValidation, validate, returnBook);

export default router;
