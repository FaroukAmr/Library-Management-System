import '../styles/shared.css';

import { AlertColor, CircularProgress } from '@mui/material';
import { ChangeEvent, FormEvent, useState } from 'react';

import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import SnackBar from './Snackbar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

type FormState = {
  isbn: { value: string; error: string; dirty: boolean };
  title: { value: string; error: string; dirty: boolean };
  author: { value: string; error: string; dirty: boolean };
  quantity: { value: string; error: string; dirty: boolean };
  shelf: { value: string; error: string; dirty: boolean };
};

const CreateBook = () => {
  const [form, setForm] = useState<FormState>({
    isbn: { value: '', error: '', dirty: false },
    title: { value: '', error: '', dirty: false },
    author: { value: '', error: '', dirty: false },
    quantity: { value: '', error: '', dirty: false },
    shelf: { value: '', error: '', dirty: false },
  });

  const [valid, setValid] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [severity, setSeverity] = useState<AlertColor>('success');
  const [message, setMessage] = useState<string>('');
  const navigate = useNavigate();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setForm((prevForm) => {
      const { name, value } = event.target;
      const updatedForm = {
        ...prevForm,
        [name]: { value, dirty: true, error: '' },
      };

      setValid(validateForm(updatedForm));
      return updatedForm;
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!valid) {
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post('/api/books', {
        isbn: form.isbn.value,
        title: form.title.value,
        author: form.author.value,
        quantity: Number(form.quantity.value),
        shelf: form.shelf.value,
      });
      if (response.status === 200) {
        setOpen(true);
        setSeverity('success');
        setMessage('Book created successfully!');
        navigate('/books');
      } else {
        setOpen(true);
        setSeverity('error');
        setMessage(response.data.errors[0].msg);
      }
    } catch (error: any) {
      console.error(error);
      setOpen(true);
      setSeverity('error');
      setMessage(error.response.data.errors[0].msg);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (updatedForm: FormState) => {
    const { isbn, title, author, quantity, shelf } = updatedForm;
    const isbnRegex = /^[0-9]{13}$/;
    const quantityRegex = /^[0-9]+$/;

    let isValid = true;

    if (!isbnRegex.test(isbn.value)) {
      if (isbn.dirty) {
        isbn.error = 'ISBN must be a 13 digit number';
      }

      isValid = false;
    }

    if (!quantityRegex.test(quantity.value) || Number(quantity.value) < 0) {
      if (quantity.dirty) {
        quantity.error = 'Quantity must be a positive number';
      }
      isValid = false;
    }

    if (title.value.length === 0) {
      if (title.dirty) {
        title.error = 'Please enter a title';
      }
      isValid = false;
    }

    if (author.value.length === 0) {
      if (author.dirty) {
        author.error = 'Please enter an author';
      }
      isValid = false;
    }

    if (shelf.value.length === 0) {
      if (shelf.dirty) {
        shelf.error = 'Please enter an shelf';
      }
      isValid = false;
    }

    return isValid;
  };

  if (loading) {
    return (
      <div className="spinner">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="main-container">
      <Paper className="paper" elevation={3}>
        <Typography id="title" variant="h4">
          Create Book
        </Typography>
        <form className="inputs-container" noValidate onSubmit={handleSubmit}>
          <TextField
            className="button"
            name="isbn"
            label="ISBN"
            variant="outlined"
            value={form.isbn.value}
            onChange={handleChange}
            error={!!form.isbn.error}
            helperText={form.isbn.error}
          />
          <TextField
            className="button"
            name="title"
            label="Title"
            variant="outlined"
            value={form.title.value}
            onChange={handleChange}
            error={!!form.title.error}
            helperText={form.title.error}
          />
          <TextField
            className="button"
            name="author"
            label="Author"
            variant="outlined"
            value={form.author.value}
            onChange={handleChange}
            error={!!form.author.error}
            helperText={form.author.error}
          />
          <TextField
            className="button"
            name="quantity"
            label="Quantity"
            variant="outlined"
            value={form.quantity.value}
            onChange={handleChange}
            error={!!form.quantity.error}
            helperText={form.quantity.error}
          />
          <TextField
            className="button"
            name="shelf"
            label="Shelf"
            variant="outlined"
            value={form.shelf.value}
            onChange={handleChange}
            error={!!form.shelf.error}
            helperText={form.shelf.error}
          />

          <Button disabled={!valid} type="submit" variant="contained">
            Create
          </Button>
        </form>
      </Paper>
      <SnackBar
        open={open}
        setOpen={setOpen}
        severity={severity}
        message={message}
      />
    </div>
  );
};

export default CreateBook;
