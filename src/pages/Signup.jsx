import React from 'react';
import { Navigate } from 'react-router-dom';

const Signup = () => {
  // If user tries to access /signup directly, redirect to login with signup mode
  return <Navigate to="/login" state={{ showSignup: true }} />;
};

export default Signup;