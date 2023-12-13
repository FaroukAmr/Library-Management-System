import express from 'express';
import { registerUser } from '../controllers/users';
import { registerValidation } from '../validators/auth';
import validate from '../middleware/validations';

const router = express.Router();

router.post('/', registerValidation, validate, registerUser);

export default router;
