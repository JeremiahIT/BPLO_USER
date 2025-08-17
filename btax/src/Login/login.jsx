// src/Login/login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Handle login form submission
  const handleLogin = (e) => {
    e.preventDefault();
    // In a real application, you would make an API call here.
    console.log('Attempting to log in with:', { email, password });
    setMessage('Login successful!');
    // Reset form fields after submission
    setEmail('');
    setPassword('');
  };

  return (
    <form onSubmit={handleLogin} className="form-container">
      <h2 className="form-title">Login</h2>
      {message && <div className="message message-success">{message}</div>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="form-input"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="form-input"
      />
      <button type="submit" className="form-button primary-button">
        Sign In
      </button>
      <div className="form-links">
        <button
          type="button"
          onClick={() => navigate('/forgotpassword')}
          className="text-link"
        >
          Forgot Password?
        </button>
        <button
          type="button"
          onClick={() => navigate('/register')}
          className="text-link"
        >
          Create Account
        </button>
      </div>
    </form>
  );
}