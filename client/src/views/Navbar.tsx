import '../styles/Navbar.css';

import Link from '@mui/material/Link';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    axios
      .get('/api/users/logout')
      .then(() => {
        navigate('/login');
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <div className="navbar-container">
      <div className="navbar">
        <Link
          onClick={() => {
            navigate('/');
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
            handleLogout();
          }}
          className="navbar-item"
        >
          Logout
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
