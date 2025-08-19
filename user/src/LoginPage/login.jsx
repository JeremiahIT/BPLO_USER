import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  // ✅ Auto-switch API (localhost vs Render)
  const API_BASE =
    window.location.hostname === 'localhost'
      ? 'http://localhost:5000/api/auth'
      : 'https://bplo-user-1.onrender.com/api/auth';

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('✅ Login successful!');
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // 👇 Direct redirect to Dashboard
        navigate('/dashboard');
      } else {
        setMessage(data.message || '❌ Login failed');
      }
    } catch (err) {
      setMessage('⚠️ Error: ' + err.message);
    }
  };

  return (
    <div className="login-container">
      {message && <div className="message-box">{message}</div>}
      <div className="form-card">
        <h2 className="form-title">Log In</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              id="email"
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="******************"
              required
            />
          </div>
          <div className="button-group">
            <button type="submit" className="submit-button primary">Sign In</button>
            <button
              type="button"
              className="text-button"
              onClick={() => navigate('/registration')}
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
