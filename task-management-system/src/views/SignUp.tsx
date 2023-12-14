import '../styles/shared.css';

import { ChangeEvent, FormEvent, useState } from 'react';

import { AlertColor } from '@mui/material';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import SnackBar from './Snackbar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

type FormState = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const SignUp = () => {
  const [form, setForm] = useState<FormState>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<FormState>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [valid, setValid] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [severity, setSeverity] = useState<AlertColor>('success');
  const [message, setMessage] = useState<string>('');

  const navigate = useNavigate();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setErrors({
      ...errors,
      [event.target.name]: '',
    });
    setForm((prevForm) => {
      const updatedForm = {
        ...prevForm,
        [event.target.name]: event.target.value,
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
      const response = await axios.post('/api/users/register', form);
      console.log(response);

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
      setMessage(error.response.data.errors[0].msg);
    }
  };

  const validateForm = (updatedForm: FormState) => {
    const { username, email, password, confirmPassword } = updatedForm;
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    const passwordRegex = /\d/;
    let isValid = true;

    if (username.length < 3) {
      setErrors((errors) => ({
        ...errors,
        username: 'Username should be at least 3 characters long',
      }));
      isValid = false;
    }

    if (!emailRegex.test(email)) {
      setErrors((errors) => ({
        ...errors,
        email: 'Please enter a valid email',
      }));
      isValid = false;
    }

    if (password.length < 8 || !passwordRegex.test(password)) {
      setErrors((errors) => ({
        ...errors,
        password:
          'Password should be at least 8 characters long and contain a number',
      }));
      isValid = false;
    }

    if (password != confirmPassword) {
      setErrors((errors) => ({
        ...errors,
        confirmPassword: 'Confirm password should match password',
      }));
      isValid = false;
    }

    return isValid;
  };

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
            value={form.username}
            onChange={handleChange}
            error={!!errors.username}
            helperText={errors.username}
          />
          <TextField
            className="button"
            name="email"
            label="Email"
            variant="outlined"
            value={form.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            className="button"
            name="password"
            label="Password"
            variant="outlined"
            type="password"
            value={form.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
          />
          <TextField
            className="button"
            name="confirmPassword"
            label="Confirm Password"
            variant="outlined"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
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
