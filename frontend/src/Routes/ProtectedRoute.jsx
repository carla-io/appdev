import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRole }) => {
  const userType = localStorage.getItem('userType');
  const authToken = localStorage.getItem('authToken');

  // Check if user is authenticated
  if (!authToken) {
    console.log('No auth token found, redirecting to login');
    return <Navigate to="/" replace />;
  }

  // Check if user has required role
  if (allowedRole && userType !== allowedRole) {
    console.log(`User type ${userType} not allowed for role ${allowedRole}`);
    // Redirect to appropriate dashboard based on user type
    switch (userType) {
      case 'admin':
        return <Navigate to="/admin" replace />;
      case 'vet':
        return <Navigate to="/vet" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  // User is authenticated and has correct role
  return children;
};

export default ProtectedRoute;