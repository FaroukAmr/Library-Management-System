import booksRouter from './routes/books';
import config from './constants';
import express from 'express';

const app = express();
app.use(express.json());

app.use('/books', booksRouter);

app.listen(config.PORT, () => {
  console.log(`Server listening on port ${config.PORT}`);
});
