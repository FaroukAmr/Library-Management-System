import React, { useEffect, useState } from 'react';

import { Book } from '../models/Book';
import BooksTable from './Table';
import SnackBar from './Snackbar';
import axios from 'axios';

const Books = () => {
  const [books, setBooks] = useState<Book[]>([]);

  const [open, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    axios
      .get('/api/books')
      .then((response) => {
        setBooks(response.data);
      })
      .catch((error) => {
        setMessage(error.response.data.errors[0].msg);
        setOpen(true);
      });
  }, []);

  return (
    <div>
      <BooksTable data={books} />
      <SnackBar
        open={open}
        setOpen={setOpen}
        severity={'error'}
        message={message}
      />
    </div>
  );
};

export default Books;
