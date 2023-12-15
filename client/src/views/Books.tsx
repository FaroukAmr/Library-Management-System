import '../styles/Books.css';

import { Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import { Book } from '../models/Book';
import BooksTable from './Table';
import { ChangeEvent } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import SnackBar from './Snackbar';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import { saveAs } from 'file-saver';

const Books = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);

  const [open, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get('/api/books')
      .then((response) => {
        setBooks(response.data);
        setFilteredBooks(response.data);
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

  const handleExportOverdue = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/borrows/export/overdue', {
        responseType: 'blob',
      });
      saveAs(
        new Blob([response.data], { type: 'text/csv' }),
        'overdue_borrowed_books_last_month.csv'
      );
    } catch (error: any) {
      setMessage(error.response.data.errors[0].msg);
      setOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleExportAll = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/borrows/export/all', {
        responseType: 'blob',
      });
      saveAs(
        new Blob([response.data], { type: 'text/csv' }),
        'all_borrowed_books_last_month.csv'
      );
    } catch (error: any) {
      setMessage(error.response.data.errors[0].msg);
      setOpen(true);
    } finally {
      setLoading(false);
    }
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

          <Button
            onClick={() => {
              handleExportOverdue();
            }}
          >
            Export Overdue
          </Button>
          <Button
            onClick={() => {
              handleExportAll();
            }}
          >
            Export All
          </Button>
        </div>
        <Typography variant="h4">All Books</Typography>
        <BooksTable
          redirectTo="/books"
          headers={[
            'title',
            'author',
            'quantity',
            'shelf',
            'isbn',
            'borrowed count',
          ]}
          data={filteredBooks}
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

export default Books;
