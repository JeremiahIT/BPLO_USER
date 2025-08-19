import React, { useState } from 'react';
import './forgotpassword.css';

/**
 * Forgot password component.
 * This component displays the form to reset the password.
 * It's a self-contained component for the forgot password view.
 * @returns {JSX.Element} The forgot password form UI.
 */
function ForgotPassword() {
  // State for form inputs
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  /**
   * Handles the form submission for the forgot password view.
   * @param {Event} e The form submission event.
   */
  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (email) {
      console.log('Sending password reset link to:', email);
      setMessage('A password reset link has been sent to your email.');
    } else {
      setMessage('Please enter your email address to reset your password.');
    }
  };

  return (
    <div className="forgot-password-container">
      {message && (
        <div className="message-box">
          {message}
        </div>
      )}
      <div className="form-card">
        <h2 className="form-title">Forgot Password?</h2>
        <p className="link-text forgot-password-text">
          Enter your email address and we'll send you a link to reset your password.
        </p>
        <form onSubmit={handleForgotPassword}>
          <div className="input-group">
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <input
              className="form-input"
              id="email"
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="button-group">
            <button
              className="submit-button tertiary"
              type="submit"
            >
              Reset Password
            </button>
          </div>
          <p className="link-text">
            <button
              className="text-button"
              type="button"
              onClick={() => console.log('Back to Log In clicked')}
            >
              Back to Log In
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
