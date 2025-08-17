// src/Login/forgotpassword.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './forgotpassword.css'; // Assuming you'll create this CSS file

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Handle forgot password form submission
  const handleForgotPassword = (e) => {
    e.preventDefault();
    // In a real application, you would make an API call here.
    console.log('Password reset requested for:', { email });
    setMessage('Password reset link sent to your email!');
    setEmail('');
  };

  return (
    <form onSubmit={handleForgotPassword} className="form-container">
      <h2 className="form-title">Forgot Password</h2>
      {message && <div className="message message-success">{message}</div>}
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="form-input"
      />
      <button type="submit" className="form-button primary-button">
        Send Reset Link
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