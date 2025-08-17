// src/Login/register.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './register.css';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Handle registration form submission
  const handleRegister = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Error: Passwords do not match!');
      return;
    }
    // In a real application, you would make an API call here.
    console.log('Attempting to register with:', { email, password });
    setMessage('Registration successful! Please log in.');
    navigate('/login'); // Navigate to login route after registration
    // Reset form fields
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <form onSubmit={handleRegister} className="form-container">
      <h2 className="form-title">Register</h2>
      {message && <div className="message message-error">{message}</div>}
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
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        className="form-input"
      />
      <button type="submit" className="form-button primary-button">
        Register
      </button>
      <div className="form-links center-link">
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="text-link"
        >
          Back to Login
        </button>
      </div>
    </form>
  );
}