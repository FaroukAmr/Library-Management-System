import '../styles/BookDetails.css';

import { Button, Typography } from '@mui/material';
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
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get('/api/books/' + id)
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
      });
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete('/api/books/' + id);
      navigate('/books');
    } catch (error: any) {
      setMessage(error.response.data.errors[0].msg);
      setOpen(true);
    }
  };

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
            <Button onClick={handleDelete} type="button" variant="contained">
              Delete
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
