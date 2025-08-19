import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './registration.css';

function Registration() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('❌ Passwords do not match.');
      return;
    }
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'https://bplo-user-1.onrender.com';
      console.log('Sending request to:', `${backendUrl}/api/auth/register`); // Debug log
      const response = await fetch(`${backendUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('✅ Registration successful! Please log in.');
        setTimeout(() => navigate('/'), 2000);
      } else {
        setMessage(data.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err); // Debug log
      setMessage(`Error: ${err.message}. Please check if the backend is running.`);
    }
  };

  return (
    <div className="registration-container">
      {message && <div className="message-box">{message}</div>}
      <div className="form-card">
        <h2 className="form-title">Register</h2>
        <form onSubmit={handleRegister}>
          <div className="input-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              className="form-input"
              id="email"
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label className="form-label" htmlFor="username">Username</label>
            <input
              className="form-input"
              id="username"
              type="text"
              placeholder="Your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              className="form-input"
              id="password"
              type="password"
              placeholder="******************"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label className="form-label" htmlFor="confirm-password">Confirm Password</label>
            <input
              className="form-input"
              id="confirm-password"
              type="password"
              placeholder="******************"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="button-group">
            <button className="submit-button secondary" type="submit">Register</button>
          </div>
          <p className="link-text">
            Already have an account?{' '}
            <button
              className="text-button"
              type="button"
              onClick={() => navigate('/')}
            >
              Log In
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Registration;