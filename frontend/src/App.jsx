import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginSignup from '../src/Pages/loginSignup';
import AdminDashboard from '../src/Pages/Admin/AdminDashboard';
import VetDashboard from './Pages/Veterinarian/VetDashboard';
import ProtectedRoute from '../src/Routes/ProtectedRoute';
import Home from './Pages/Home'; // ✅

const App = () => {
  console.log('Rendering App, current userType:', localStorage.getItem('userType'));

  const isAuthenticated = () => {
    return localStorage.getItem('authToken') && localStorage.getItem('userType');
  };

  const getDashboardRoute = () => {
    const userType = localStorage.getItem('userType');
    switch (userType) {
      case 'admin':
        return '/admin';
      case 'vet':
        return '/vet';
      case 'user':
        return '/home'; // added this just in case
      default:
        return '/';
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Login / Signup */}
        <Route 
          path="/" 
          element={
            isAuthenticated() ? 
              <Navigate to={getDashboardRoute()} replace /> : 
              <LoginSignup />
          } 
        />

        {/* Admin Dashboard */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Vet Dashboard */}
        <Route
          path="/vet"
          element={
            <ProtectedRoute allowedRole="vet">
              <VetDashboard />
            </ProtectedRoute>
          }
        />

        {/* Home for regular users */}
        <Route
          path="/home"
          element={
            <ProtectedRoute allowedRole="user">
              <Home />
            </ProtectedRoute>
          }
        />

        {/* Debug test route */}
        <Route path="/test" element={<h1>Test Route Works!</h1>} />

        {/* Catch-all fallback route */}
        <Route 
          path="*" 
          element={
            <Navigate to={isAuthenticated() ? getDashboardRoute() : '/'} replace />
          } 
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
