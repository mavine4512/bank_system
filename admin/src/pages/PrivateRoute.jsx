import React from 'react';
import { jwtDecode } from 'jwt-decode';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const isTokenValid = (token) => {
  try {
    const decodedToken = jwtDecode(token);
    // Current time in seconds
    const currentTime = Date.now() / 1000; 
    // Token is valid if expiration time is in the future
    return decodedToken.exp > currentTime; 
  } catch (error) {
    console.error('Invalid token:', error);
    return false;
  }
};

const PrivateRoute = () => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const isAuthenticated = token && isTokenValid(token);

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default PrivateRoute;
