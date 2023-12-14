import '../styles/shared.css';

import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';

import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';

const PrivateRoutes = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await axios.get('/api/users/check-authentication');
        setIsAuthenticated(response.data.isAuthenticated);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuthentication();
  }, []);

  if (isLoading) {
    return (
      <div className="spinner">
        <CircularProgress />
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
