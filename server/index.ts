import './middleware/passport';

import booksRouter from './routes/books';
import config from './constants';
import cookiesParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import passport from 'passport';
import usersRouter from './routes/users';

const app = express();
app.use(express.json());
app.use(cookiesParser());
app.use(cors({ origin: config.CLIENT_URL, credentials: true }));
app.use(passport.initialize());

app.use('/books', booksRouter);
app.use('/users', usersRouter);

app.listen(config.PORT, () => {
  console.log(`Server listening on port ${config.PORT}`);
});
