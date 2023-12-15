import '../styles/shared.css';

import { AlertColor, CircularProgress } from '@mui/material';
import { ChangeEvent, FormEvent, useState } from 'react';

import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import SnackBar from './Snackbar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

type FormState = {
  username: { value: string; error: string; dirty: boolean };
  email: { value: string; error: string; dirty: boolean };
  password: { value: string; error: string; dirty: boolean };
  confirmPassword: { value: string; error: string; dirty: boolean };
};

const SignUp = () => {
  const [form, setForm] = useState<FormState>({
    username: { value: '', error: '', dirty: false },
    email: { value: '', error: '', dirty: false },
    password: { value: '', error: '', dirty: false },
    confirmPassword: { value: '', error: '', dirty: false },
  });

  const [valid, setValid] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [severity, setSeverity] = useState<AlertColor>('success');
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

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
      const response = await axios.post('/api/users/register', {
        username: form.username.value,
        email: form.email.value,
        password: form.password.value,
      });
      if (response.status === 201) {
        setOpen(true);
        setSeverity('success');
        setMessage('Successfully registered!');
      } else {
        setOpen(true);
        setSeverity('error');
        setMessage('Something went wrong, please try again.');
      }
    } catch (error: any) {
      setOpen(true);
      setSeverity('error');
      setMessage(error.response.data || error.response.data.errors[0].msg);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (updatedForm: FormState) => {
    const { username, email, password, confirmPassword } = updatedForm;
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    const passwordRegex = /\d/;
    let isValid = true;

    if (username.value.length < 3) {
      if (username.dirty) {
        username.error = 'Username should be at least 3 characters long';
      }
      isValid = false;
    }

    if (!emailRegex.test(email.value)) {
      if (email.dirty) {
        email.error = 'Please enter a valid email';
      }
      isValid = false;
    }

    if (password.value.length < 8 || !passwordRegex.test(password.value)) {
      if (password.dirty) {
        password.error =
          'Password must be at least 8 characters long and contain at least one number';
      }
      isValid = false;
    }

    if (password.value != confirmPassword.value) {
      if (confirmPassword.dirty) {
        confirmPassword.error = 'Passwords must match';
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
          Register a new account
        </Typography>
        <form className="inputs-container" noValidate onSubmit={handleSubmit}>
          <TextField
            className="button"
            name="username"
            label="Username"
            variant="outlined"
            value={form.username.value}
            onChange={handleChange}
            error={!!form.username.error}
            helperText={form.username.error}
          />
          <TextField
            className="button"
            name="email"
            label="Email"
            variant="outlined"
            value={form.email.value}
            onChange={handleChange}
            error={!!form.email.error}
            helperText={form.email.error}
          />
          <TextField
            className="button"
            name="password"
            label="Password"
            variant="outlined"
            type="password"
            value={form.password.value}
            onChange={handleChange}
            error={!!form.password.error}
            helperText={form.password.error}
          />
          <TextField
            className="button"
            name="confirmPassword"
            label="Confirm Password"
            variant="outlined"
            type="password"
            value={form.confirmPassword.value}
            onChange={handleChange}
            error={!!form.confirmPassword.error}
            helperText={form.confirmPassword.error}
          />
          <Link
            component="button"
            variant="body2"
            onClick={() => {}}
            type="button"
            onClickCapture={() => {
              navigate('/login');
            }}
          >
            Already registered? Sign In
          </Link>
          <Button disabled={!valid} type="submit" variant="contained">
            Sign Up
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

export default SignUp;
