import '../styles/Books.css';

import { useEffect, useState } from 'react';

import BooksTable from './Table';
import { BorrowedBook } from '../models/BorrowedBook';
import { ChangeEvent } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import SnackBar from './Snackbar';
import TextField from '@mui/material/TextField';
import { Typography } from '@mui/material';
import axios from 'axios';

const MyBooks = () => {
  const [books, setBooks] = useState<BorrowedBook[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<BorrowedBook[]>([]);

  const [open, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get('/api/borrows')
      .then((response) => {
        setBooks(response.data);
        setFilteredBooks(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        setMessage(error.response.data.errors[0].msg);
        setOpen(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const ans = books.filter((book) => {
      return (
        book.title.toLowerCase().includes(event.target.value.toLowerCase()) ||
        book.author.toLowerCase().includes(event.target.value.toLowerCase()) ||
        book.isbn.toLowerCase().includes(event.target.value.toLowerCase())
      );
    });
    setFilteredBooks(ans);
  };

  if (loading) {
    return (
      <div className="spinner">
        <CircularProgress />
      </div>
    );
  }

  return (
    <>
      <div className="books-container">
        <div className="books-header">
          <div id="input-with-icon-textfield">
            <TextField
              style={{ width: '100%' }}
              label="Search"
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlinedIcon />
                  </InputAdornment>
                ),
              }}
              variant="standard"
            />
          </div>
        </div>
        <Typography variant="h4">Borrowed Books</Typography>
        <BooksTable
          headers={[
            'title',
            'author',
            'quantity',
            'shelf',
            'isbn',
            'borrowed date',
            'expected return date',
          ]}
          data={filteredBooks}
          redirectTo={'/my-books'}
        />
      </div>
      <SnackBar
        open={open}
        setOpen={setOpen}
        severity={'error'}
        message={message}
      />
    </>
  );
};

export default MyBooks;
