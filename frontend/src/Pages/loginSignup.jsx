import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './CSS/loginSignup.css';

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    email: 'johnsmith@gmail.com',
    password: '••••••••••'
  });
  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    profilePicture: null,
    isVeterinarian: false,
    licenseNumber: ''
  });

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });

      const data = await response.json();

      if (response.ok) {
        // Store user data in localStorage
        localStorage.setItem('userEmail', data.user?.email || loginData.email);
        localStorage.setItem('userType', data.user?.userType || 'user');
        localStorage.setItem('authToken', data.token);
        
        toast.success('Login successful! Welcome back.', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        console.log(data); // Handle token and user here
      } else {
        toast.error(data.message || 'Login failed. Please try again.', {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (err) {
      console.error('Login error:', err);
      toast.error('Something went wrong during login. Please check your connection.', {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleRegister = async () => {
    try {
      // Validate password confirmation
      if (registerData.password !== registerData.confirmPassword) {
        toast.error('Passwords do not match!', {
          position: "top-right",
          autoClose: 4000,
        });
        return;
      }

      const formData = new FormData();
      formData.append('name', `${registerData.firstName} ${registerData.lastName}`);
      formData.append('email', registerData.email);
      formData.append('password', registerData.password);
      formData.append('userType', registerData.isVeterinarian ? 'vet' : 'user');
      
      if (registerData.isVeterinarian) {
        formData.append('licenseNumber', registerData.licenseNumber);
      }
      if (registerData.profilePicture) {
        formData.append('profilePhoto', registerData.profilePicture);
      }

      const response = await fetch('http://localhost:5000/auth/register', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        // Store user data in localStorage
        localStorage.setItem('userEmail', registerData.email);
        localStorage.setItem('userType', registerData.isVeterinarian ? 'vet' : 'user');
        localStorage.setItem('authToken', data.token);
        
        toast.success('Registration successful! Welcome to Captivity and Care.', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        console.log(data); // Handle token and user here
        setIsLogin(true);
      } else {
        toast.error(data.message || 'Registration failed. Please try again.', {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (err) {
      console.error('Registration error:', err);
      toast.error('Something went wrong during registration. Please check your connection.', {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegisterChange = (e) => {
    const { name, value, type, files, checked } = e.target;
    setRegisterData(prev => ({
      ...prev,
      [name]: type === 'file' ? files[0] : type === 'checkbox' ? checked : value
    }));
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    // Reset password visibility when switching forms
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Eye icon SVG components
  const EyeIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="12" r="3" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const EyeOffIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="m1 1 22 22" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6.71 6.71C4.06 8.29 2 12 2 12s4 8 11 8c1.54 0 2.95-.34 4.21-.91" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10.46 10.46a3 3 0 0 0 4.08 4.08" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17.18 17.18C15.41 18.38 13.78 19 12 19c-7 0-11-8-11-8a18.498 18.498 0 0 1 2.82-3.82" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  return (
    <div className="auth-container">
      {/* Left Panel */}
      <div className={`left-panel ${isLogin ? 'login-panel' : 'register-panel'}`}>
  
      </div>
      
      {/* Right Panel */}
      <div className="right-panel">
        {/* Header */}
        <div className="header">
          <h1 className="company-name">Captivity and Care</h1>
        </div>
        
        {/* Form Container */}
        <div className="auth-form-container">
          <h2 className="welcome-title">
            {isLogin ? 'Welcome Back!' : 'Create Account'}
          </h2>
          
          <div className={`auth-form ${isLogin ? 'login-form' : 'register-form'}`}>
            {isLogin ? (
              // Login Form
              <>
                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-input"
                    value={loginData.email}
                    onChange={handleLoginChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="password" className="form-label">Password</label>
                  <div className="password-input-container">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      className="form-input password-input"
                      value={loginData.password}
                      onChange={handleLoginChange}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={togglePasswordVisibility}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>
                
                <button type="button" className="auth-button" onClick={handleLogin}>
                  Sign in
                </button>
                
                <div className="auth-toggle">
                  <span className="toggle-text">Doesn't Have an Account?</span>
                  <span className="toggle-link" onClick={toggleAuthMode}>Sign up</span>
                </div>
              </>
            ) : (
              // Register Form
              <>
                {/* Profile Picture Section */}
                <div className="profile-picture-section">
                  <div className="profile-picture-container">
                    <div className="profile-picture-preview">
                      {registerData.profilePicture ? (
                        <img 
                          src={URL.createObjectURL(registerData.profilePicture)} 
                          alt="Profile Preview" 
                          className="profile-image"
                        />
                      ) : (
                        <div className="profile-placeholder">
                          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M20.5899 22C20.5899 18.13 16.7399 15 11.9999 15C7.25991 15 3.40991 18.13 3.40991 22" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      )}
                    </div>
                    <label htmlFor="profilePicture" className="profile-upload-label">
                      Upload Photo
                    </label>
                    <input
                      type="file"
                      id="profilePicture"
                      name="profilePicture"
                      accept="image/*"
                      onChange={handleRegisterChange}
                      className="profile-input"
                    />
                  </div>
                </div>

                {/* Name Row */}
                <div className="name-row">
                  <div className="form-group half-width">
                    <label htmlFor="firstName" className="form-label">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      className="form-input"
                      value={registerData.firstName}
                      onChange={handleRegisterChange}
                      placeholder="John"
                    />
                  </div>
                  
                  <div className="form-group half-width">
                    <label htmlFor="lastName" className="form-label">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      className="form-input"
                      value={registerData.lastName}
                      onChange={handleRegisterChange}
                      placeholder="Smith"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="registerEmail" className="form-label">Email</label>
                  <input
                    type="email"
                    id="registerEmail"
                    name="email"
                    className="form-input"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    placeholder="johnsmith@gmail.com"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="registerPassword" className="form-label">Password</label>
                  <div className="password-input-container">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="registerPassword"
                      name="password"
                      className="form-input password-input"
                      value={registerData.password}
                      onChange={handleRegisterChange}
                      placeholder="••••••••••"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={togglePasswordVisibility}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                  <div className="password-input-container">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      className="form-input password-input"
                      value={registerData.confirmPassword}
                      onChange={handleRegisterChange}
                      placeholder="••••••••••"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={toggleConfirmPasswordVisibility}
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>
                
                {/* Veterinarian Section */}
                <div className="veterinarian-section">
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      id="isVeterinarian"
                      name="isVeterinarian"
                      checked={registerData.isVeterinarian}
                      onChange={handleRegisterChange}
                      className="veterinarian-checkbox"
                    />
                    <label htmlFor="isVeterinarian" className="checkbox-label">
                      I am a licensed veterinarian
                    </label>
                  </div>
                  
                  {registerData.isVeterinarian && (
                    <div className="form-group license-group">
                      <label htmlFor="licenseNumber" className="form-label">
                        Veterinary License Number <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        id="licenseNumber"
                        name="licenseNumber"
                        className="form-input"
                        value={registerData.licenseNumber}
                        onChange={handleRegisterChange}
                        placeholder="Enter your license number"
                        required={registerData.isVeterinarian}
                        pattern="\d{6,7}"
                        maxLength={7}
                      />
                    </div>
                  )}
                </div>
                
                <button type="button" className="auth-button" onClick={handleRegister}>
                  Sign Up
                </button>
                
                <div className="auth-toggle">
                  <span className="toggle-text">Already have an account?</span>
                  <span className="toggle-link" onClick={toggleAuthMode}>Sign in</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default LoginSignup;