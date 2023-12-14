import {
  checkAuthentication,
  loginUser,
  logoutUser,
  registerUser,
} from '../controllers/users';
import { loginValidation, registerValidation } from '../validators/auth';

import express from 'express';
import userAuth from '../middleware/auth';
import validate from '../middleware/validations';

const router = express.Router();

router.post('/register', registerValidation, validate, registerUser);
router.post('/login', loginValidation, validate, loginUser);
router.get('/check-authentication', userAuth, checkAuthentication);
router.get('/logout', userAuth, logoutUser);
export default router;
