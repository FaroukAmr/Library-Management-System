import '../styles/Books.css';

import { useEffect, useState } from 'react';

import { Book } from '../models/Book';
import BooksTable from './Table';
import { Button } from '@mui/material';
import { ChangeEvent } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import SnackBar from './Snackbar';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Books = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);

  const [open, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('/api/books')
      .then((response) => {
        setBooks(response.data);
        setFilteredBooks(response.data);
      })
      .catch((error) => {
        setMessage(error.response.data.errors[0].msg);
        setOpen(true);
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

          <Button
            onClick={() => {
              navigate('/books/create');
            }}
          >
            Add Book
          </Button>
        </div>

        <BooksTable data={filteredBooks} />
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

export default Books;
