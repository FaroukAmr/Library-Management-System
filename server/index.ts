import './middleware/passport';

import booksRouter from './routes/books';
import borrowsRouter from './routes/borrows';
import config from './constants';
import cookiesParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import passport from 'passport';
import rateLimit from 'express-rate-limit';
import usersRouter from './routes/users';

const app = express();
app.use(express.json());
app.use(cookiesParser());
app.use(cors({ origin: config.CLIENT_URL, credentials: true }));
app.use(passport.initialize());

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: 'Too many requests from this IP, please try again late',
});

app.use('/books', booksRouter);
app.use('/users', usersRouter);
app.use('/borrows', borrowsRouter);

app.listen(config.PORT, () => {
  console.log(`Server listening on port ${config.PORT}`);
});
