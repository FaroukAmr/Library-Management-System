import '../styles/BookDetails.css';

import { Button, CircularProgress, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { BorrowedBook } from '../models/BorrowedBook';
import SnackBar from './Snackbar';
import axios from 'axios';

export const BorrowedBooksDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [open, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [book, setBook] = useState<BorrowedBook | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  useEffect(() => {
    setLoading(true);
    axios
      .get('/api/borrows/' + id)
      .then((response) => {
        if (response.data.length === 0) {
          setMessage('Book not found');
          setOpen(true);
        } else {
          setBook(response.data);
        }
      })
      .catch((error) => {
        setMessage(error.response.data.errors[0].msg);
        setOpen(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleReturn = async () => {
    setLoading(true);
    try {
      await axios.post('/api/borrows', {
        isbn: id,
      });
      navigate('/my-books');
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
      {book && (
        <div className="details-container">
          <Typography variant="h4">Book Details</Typography>
          <div className="details">
            <Typography variant="h6">Title: {book.title}</Typography>
            <Typography variant="h6">Author: {book.author}</Typography>
            <Typography variant="h6">ISBN: {book.isbn}</Typography>
            <Typography variant="h6">Quantity: {book.quantity}</Typography>
            <Typography variant="h6">Shelf: {book.shelf}</Typography>
            <Typography variant="h6">
              Borrowed: {new Date(book.borrowed_date).toLocaleDateString()}
            </Typography>
            <Typography variant="h6">
              Expected Return:{' '}
              {new Date(book.expected_return_date).toLocaleDateString()}
            </Typography>
          </div>
          <div className="buttons-container">
            <Button onClick={handleReturn} type="button" variant="contained">
              Return Book
            </Button>
          </div>
        </div>
      )}

      <SnackBar
        open={open}
        setOpen={setOpen}
        severity={'error'}
        message={message}
      />
    </>
  );
};
