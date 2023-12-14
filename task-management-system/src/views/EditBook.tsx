import '../styles/shared.css';

import { ChangeEvent, FormEvent, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { AlertColor } from '@mui/material';
import { Book } from '../models/Book';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import SnackBar from './Snackbar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import axios from 'axios';

type FormState = {
  title: { value: string; error: string; dirty: boolean };
  author: { value: string; error: string; dirty: boolean };
  quantity: { value: string; error: string; dirty: boolean };
  shelf: { value: string; error: string; dirty: boolean };
};

interface EditBookProps {
  data: Book;
}

const EditBook = (props: EditBookProps) => {
  const { id } = useParams<{ id: string }>();

  const [form, setForm] = useState<FormState>({
    title: { value: props.data.title, error: '', dirty: false },
    author: { value: props.data.author, error: '', dirty: false },
    quantity: {
      value: props.data.quantity.toString(),
      error: '',
      dirty: false,
    },
    shelf: { value: props.data.shelf, error: '', dirty: false },
  });

  const [valid, setValid] = useState<boolean>(true);
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
      const response = await axios.put('/api/books/' + id, {
        isbn: props.data.isbn,
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
    }
  };

  const validateForm = (updatedForm: FormState) => {
    const { title, author, quantity, shelf } = updatedForm;
    const quantityRegex = /^[0-9]+$/;

    let isValid = true;

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
            value={props.data.isbn}
            disabled={true}
            helperText={'ISBN cannot be changed'}
          />
          <TextField
            className="button"
            name="title"
            label="title"
            variant="outlined"
            value={form.title.value}
            onChange={handleChange}
            error={!!form.title.error}
            helperText={form.title.error}
          />
          <TextField
            className="button"
            name="author"
            label="author"
            variant="outlined"
            value={form.author.value}
            onChange={handleChange}
            error={!!form.author.error}
            helperText={form.author.error}
          />
          <TextField
            className="button"
            name="quantity"
            label="quantity"
            variant="outlined"
            value={form.quantity.value}
            onChange={handleChange}
            error={!!form.quantity.error}
            helperText={form.quantity.error}
          />
          <TextField
            className="button"
            name="shelf"
            label="shelf"
            variant="outlined"
            value={form.shelf.value}
            onChange={handleChange}
            error={!!form.shelf.error}
            helperText={form.shelf.error}
          />

          <Button disabled={!valid} type="submit" variant="contained">
            Edit
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

export default EditBook;
