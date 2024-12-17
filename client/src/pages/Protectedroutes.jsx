import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // Check for token in localStorage

  if (!token) {
    // If no token is found, redirect to login page
    return <Navigate to="/loginadmin" replace />;
  }

  // If token exists, render the children (protected component/page)
  return children;
};

export default ProtectedRoute;
