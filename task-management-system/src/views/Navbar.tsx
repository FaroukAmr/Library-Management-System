import '../styles/Navbar.css';

import Link from '@mui/material/Link';
import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const navigate = useNavigate();
  return (
    <div className="navbar-container">
      <div className="navbar">
        <Link
          onClick={() => {
            navigate('/home');
          }}
          className="navbar-item"
        >
          Home
        </Link>
        <Link
          onClick={() => {
            navigate('/books');
          }}
          className="navbar-item"
        >
          Books
        </Link>
        <Link
          onClick={() => {
            navigate('/books/create');
          }}
          className="navbar-item"
        >
          Create Book
        </Link>
      </div>
      <div className="navbar">
        <Link
          onClick={() => {
            navigate('/sign-up');
          }}
          className="navbar-item"
        >
          Sign Up
        </Link>
        <Link
          onClick={() => {
            navigate('/login');
          }}
          className="navbar-item"
        >
          Login
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
