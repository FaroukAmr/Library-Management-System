import '../styles/BookDetails.css';

import { Button, CircularProgress, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Book } from '../models/Book';
import EditBook from './EditBook';
import SnackBar from './Snackbar';
import axios from 'axios';

export const BookDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [open, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [book, setBook] = useState<Book | null>(null);
  const [edit, setEdit] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [borrowers, setBorrowers] = useState<any[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    setLoading(true);
    axios
      .get('/api/books/' + id)
      .then((response) => {
        if (response.data.length === 0) {
          setMessage('Book not found');
          setOpen(true);
        } else {
          setBook(response.data);
          getAllBorrowers();
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

  const handleDelete = async () => {
    setLoading(true);
    try {
      await axios.delete('/api/books/' + id);
      navigate('/books');
    } catch (error: any) {
      setMessage(error.response.data.errors[0].msg);
      setOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleBorrow = async () => {
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

  const getAllBorrowers = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/borrows/' + id);
      setBorrowers(response.data);
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

  if (edit) {
    return <EditBook data={book!} />;
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
          </div>
          <div className="buttons-container">
            <Button
              onClick={() => {
                setEdit(true);
              }}
              type="button"
              variant="contained"
            >
              Edit
            </Button>
            <Button onClick={handleBorrow} type="button" variant="contained">
              Borrow
            </Button>
            <Button onClick={handleDelete} type="button" variant="contained">
              Delete
            </Button>
          </div>
          <br />
          <Typography variant="h4">Borrowers</Typography>
          {borrowers.map((borrower, i) => {
            return (
              <div key={borrower.username + i} className="borrower">
                <Typography variant="h6">
                  Borrower: {borrower.username}
                </Typography>
                <Typography variant="h6">Email: {borrower.email}</Typography>
                <Typography variant="h6">
                  Borrow date:{' '}
                  {new Date(borrower.borrowed_date).toLocaleDateString()}
                </Typography>
                <Typography variant="h6">
                  Expected return date:{' '}
                  {new Date(borrower.expected_return_date).toLocaleDateString()}
                </Typography>
              </div>
            );
          })}
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
