// import React from 'react';
// import LoginSignup from '../src/Pages/loginSignup'
// import { BrowserRouter, Routes, Route } from 'react-router-dom';

// const App = () => {
//     return (
      
//         <BrowserRouter>
//           <Routes>
            
//             <Route path="/" element={<LoginSignup />} />
            
          
//           </Routes>
//         </BrowserRouter>
    
//     );
// };

// export default App
// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginSignup from '../src/Pages/loginSignup';
import AdminDashboard from '../src/Pages/Admin/AdminDashboard';
import VetDashboard from '../src/Pages/VetDashboard';
import ProtectedRoute from '../src/Routes/ProtectedRoute';

const App = () => {
  console.log('Rendering App, current userType:', localStorage.getItem('userType'));

  // Helper function to check if user is authenticated
  const isAuthenticated = () => {
    return localStorage.getItem('authToken') && localStorage.getItem('userType');
  };

  // Helper function to get user's dashboard route based on userType
  const getDashboardRoute = () => {
    const userType = localStorage.getItem('userType');
    switch (userType) {
      case 'admin':
        return '/admin';
      case 'vet':
        return '/vet';
      default:
        return '/';
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Login/Signup Route - redirect to dashboard if already authenticated */}
        <Route 
          path="/" 
          element={
            isAuthenticated() ? 
              <Navigate to={getDashboardRoute()} replace /> : 
              <LoginSignup />
          } 
        />

        {/* Admin Dashboard Route */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Vet Dashboard Route */}
        <Route
          path="/vet"
          element={
            <ProtectedRoute allowedRole="vet">
              <VetDashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch-all route - redirect to appropriate dashboard or login */}
        <Route 
          path="*" 
          element={
            <Navigate to={isAuthenticated() ? getDashboardRoute() : '/'} replace />
          } 
        />

        {/* DEBUG Route */}
        <Route path="/test" element={<h1>Test Route Works!</h1>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;