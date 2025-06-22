import React from 'react';
import LoginSignup from '../src/Pages/loginSignup'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const App = () => {
    return (
      
        <BrowserRouter>
          <Routes>
            
            <Route path="/" element={<LoginSignup />} />
            
          
          </Routes>
        </BrowserRouter>
    
    );
};

export default App
