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
  email: { value: string; error: string; dirty: boolean };
  password: { value: string; error: string; dirty: boolean };
};

const Login = () => {
  const [form, setForm] = useState<FormState>({
    email: { value: '', error: '', dirty: false },
    password: { value: '', error: '', dirty: false },
  });

  const [valid, setValid] = useState<boolean>(false);
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
      const response = await axios.post('/api/users/login', form);

      if (response.status === 200) {
        setOpen(true);
        setSeverity('success');
        setMessage('Logged in successfully!');
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

    if (!emailRegex.test(email.value)) {
      if (email.dirty) {
        email.error = 'Please enter a valid email address';
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
