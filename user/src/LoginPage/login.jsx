import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', { // Fixed port
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('✅ Login successful!');
        localStorage.setItem('token', data.token); // Store JWT
        setTimeout(() => navigate('/dashboard'), 2000); // Redirect to dashboard
      } else {
        setMessage(data.message || 'Login failed');
      }
    } catch (err) {
      setMessage('Error: ' + err.message);
    }
  };

  return (
    <div className="login-container">
      {message && <div className="message-box">{message}</div>}
      <div className="form-card">
        <h2 className="form-title">Log In</h2>
        <form onSubmit={handleLogin}>
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
          <div className="button-group">
            <button className="submit-button primary" type="submit">Sign In</button>
            <button
              className="text-button"
              type="button"
              onClick={() => navigate('/forgotpassword')}
            >
              Forgot Password?
            </button>
          </div>
          <p className="link-text">
            Don't have an account?{' '}
            <button
              className="text-button"
              type="button"
              onClick={() => navigate('/registration')}
            >
              Register
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;