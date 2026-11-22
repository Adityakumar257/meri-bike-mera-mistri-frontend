// PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');
  const user = localStorage.getItem('user');

  if (!token || !user) {
    // User not logged in, redirect to login
    return <Navigate to="/login" />;
  }

  try {
    const userData = JSON.parse(user);
    
    // Additional check: if email is not verified
    if (!userData.emailVerified) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      return <Navigate to="/login" state={{ message: 'Please verify your email first' }} />;
    }

    return children;
  } catch (error) {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    return <Navigate to="/login" />;
  }
};

export default PrivateRoute;