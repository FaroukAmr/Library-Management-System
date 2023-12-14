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
  email: string;
  password: string;
};

const Login = () => {
  const [form, setForm] = useState<FormState>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<FormState>({
    email: '',
    password: '',
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
      const response = await axios.post(
        'http://localhost:9000/users/login',
        form
      );
      console.log(response);

      if (response.status === 200) {
        setOpen(true);
        setSeverity('success');
        setMessage('Successfully registered!');
      } else {
        setOpen(true);
        setSeverity('error');
        setMessage(response.data.errors[0].msg);
      }
    } catch (error: any) {
      setOpen(true);
      setSeverity('error');
      setMessage(error.response.data.errors[0].msg);
    }
  };

  const validateForm = (updatedForm: FormState) => {
    const { email, password } = updatedForm;
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    const passwordRegex = /\d/;
    let isValid = true;

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

    return isValid;
  };

  return (
    <div className="main-container">
      <Paper className="paper" elevation={3}>
        <Typography id="title" variant="h4">
          Welcome Back!
        </Typography>
        <form className="inputs-container" noValidate onSubmit={handleSubmit}>
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
          <Link
            component="button"
            type="button"
            variant="body2"
            onClick={() => {
              navigate('/sign-up');
            }}
          >
            New user? Sign Up
          </Link>
          <Button disabled={!valid} type="submit" variant="contained">
            Login
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

export default Login;
