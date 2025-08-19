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
      // ✅ backend URL (make sure it's consistent with server.js)
      const backendUrl =
        process.env.REACT_APP_BACKEND_URL || 'https://bplo-user.onrender.com';

      console.log('📡 Sending request to:', `${backendUrl}/api/auth/register`);

      const response = await fetch(`${backendUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // ✅ Keep cookies + auth
        body: JSON.stringify({ email, username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('✅ Registration successful! Redirecting...');
        setTimeout(() => navigate('/'), 1500);
      } else {
        setMessage(data.message || data.error || '❌ Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setMessage(`⚠️ Error: ${err.message}`);
    }
  };

  return (
    <div className="registration-container">
      {message && <div className="message-box">{message}</div>}
      <div className="form-card">
        <h2 className="form-title">Register</h2>
        <form onSubmit={handleRegister}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              placeholder="Enter email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              placeholder="Enter username"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              placeholder="********"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              placeholder="********"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button className="submit-button" type="submit">
            Register
          </button>

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
