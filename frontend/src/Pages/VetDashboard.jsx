// src/Pages/VetDashboard.jsx
import React from 'react';

const VetDashboard = () => {
  return (
    <div>
      <h1>Welcome Vet!</h1>
      <button onClick={() => {
        localStorage.clear();
        window.location.href = "/";
      }}>Logout</button>
    </div>
  );
};

export default VetDashboard;
