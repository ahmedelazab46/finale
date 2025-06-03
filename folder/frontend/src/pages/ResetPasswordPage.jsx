import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const ResetPasswordPage = () => {
  const query = useQuery();
  const uid = query.get('uid');
  const token = query.get('token');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const response = await axios.post(
        `${API_BASE_URL}/users/password-reset/confirm/?uid=${uid}&token=${token}`,
        { new_password: newPassword, confirm_password: confirmPassword }
      );
      setMessage(response.data.message || 'Password changed successfully');
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Failed to reset password. Please try again.'
      );
    }
  };

  return (
    <div className="reset-password-container">
      <h1>Set New Password</h1>
      {error && <div className="error-message">{error}</div>}
      {message && <div className="success-message">{message}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
        />
        <button type="submit">Change Password</button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
