import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiMail } from 'react-icons/hi';
import { BsChatDots, BsGlobe } from 'react-icons/bs';
import { FiPhone } from 'react-icons/fi';
import axios from 'axios';
import '../styles/Login.css';

const API_BASE_URL = 'http://127.0.0.1:8000'; // عدل إذا كان لديك عنوان آخر

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!email) {
      setError('Please enter your email');
      return;
    }
    try {
      const response = await axios.post(`${API_BASE_URL}/users/password-reset/`, { email });
      setMessage(response.data.message || 'Password reset link has been sent to your email');
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Failed to send password reset email. Please try again.'
      );
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-form-section">
          <div className="brand">
            <Link to="/" className="logo-link">
              <img 
                src="/lewagon-logo.png" 
                alt="Le Wagon" 
                className="logo"
                onError={(e) => {
                  console.error('Logo failed to load');
                  e.target.src = 'https://www.lewagon.com/assets/v4/logo-lewagon-9c19fb39a748cd3b1f49059ce0dc6c0dfc4cc2447d5a9a3e01bd2d5a214faf3c.svg';
                }} 
              />
            </Link>
          </div>

          <div className="login-form">
            <h1>Reset Password</h1>
            <p className="subtitle">
              Enter your email to reset your password
            </p>

            {error && <div className="error-message">{error}</div>}
            {message && <div className="success-message">{message}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="form-input"
                />
              </div>

              <button type="submit" className="sign-in-button">
                Send Reset Link
              </button>

              <p className="signup-prompt">
                Remember your password?{' '}
                <Link to="/login" className="signup-link">
                  Back to Login
                </Link>
              </p>
            </form>
          </div>
        </div>

        <div className="illustration-section">
          <div className="floating-icons">
            <HiMail className="icon mail" />
            <BsChatDots className="icon chat" />
            <BsGlobe className="icon globe" />
            <FiPhone className="icon phone" />
          </div>
          <div className="illustration">
            <svg className="woman-illustration" viewBox="0 0 500 500">
              {/* Simple abstract person illustration */}
              <circle cx="250" cy="150" r="50" className="head" />
              <path d="M200 200 Q250 300 300 200" className="body" />
              <path d="M250 250 L200 350" className="left-arm" />
              <path d="M250 250 L300 300 L320 280" className="right-arm" />
              {/* OK gesture */}
              <circle cx="320" cy="280" r="15" className="ok-gesture" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;