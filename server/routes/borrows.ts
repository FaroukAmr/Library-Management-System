import {
  borrowBook,
  getAllBorrowedBooks,
  returnBook,
} from '../controllers/borrow';

import { borrowsValidation } from '../validators/borrows';
import express from 'express';
import userAuth from '../middleware/auth';
import validate from '../middleware/validations';

const router = express.Router();

router.get('/', userAuth, validate, getAllBorrowedBooks);

router.post('/', userAuth, borrowsValidation, validate, borrowBook);

router.patch('/', userAuth, borrowsValidation, validate, returnBook);

export default router;
