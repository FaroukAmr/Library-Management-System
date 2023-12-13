import booksRouter from './routes/books';
import config from './constants';
import express from 'express';
import usersRouter from './routes/users';

const app = express();
app.use(express.json());

app.use('/books', booksRouter);
app.use('/users', usersRouter);

app.listen(config.PORT, () => {
  console.log(`Server listening on port ${config.PORT}`);
});
