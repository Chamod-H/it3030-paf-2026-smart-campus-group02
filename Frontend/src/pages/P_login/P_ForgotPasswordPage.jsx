import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { validateEmailReq } from '../../validation/P_forgotPasswordValidation';
import './P_LoginPage.css';

const P_ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const emailError = validateEmailReq(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/password/forgot', { email });
      setSuccess(response.data.message || 'OTP successfully sent to your email.');
      setTimeout(() => {
        navigate('/reset-password', { state: { email } });
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-login-page">
      <div className="p-login-card">
        <div className="p-login-header">
          <div className="p-login-logo">
            <span className="p-logo-icon">🔑</span>
            <h1>Password Reset</h1>
          </div>
          <p className="p-login-subtitle">
            Enter your student email address to receive a secure 6-digit OTP code.
          </p>
        </div>

        {error && (
          <div className="p-login-error">
            <span className="p-error-icon">⚠️</span>
            {error}
          </div>
        )}

        {success && (
          <div className="p-login-error" style={{ backgroundColor: '#e6f4ea', color: '#137333', border: '1px solid #ceead6' }}>
            <span className="p-error-icon">✅</span>
            {success}
          </div>
        )}

        <form className="p-login-standard-form" onSubmit={handleSubmit}>
          <div className="p-login-field">
            <label htmlFor="email">Student Email</label>
            <input 
              type="email" 
              id="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="e.g. it2026xxxx@my.sliit.lk" 
              disabled={loading || success !== ''}
            />
          </div>

          <button type="submit" className="p-login-submit-btn" disabled={loading || success !== ''}>
            {loading ? 'Sending Request...' : 'Send OTP Code'}
          </button>
        </form>

        <div className="p-login-divider">
          <span>OR</span>
        </div>

        <div className="p-login-footer">
          <p>Remembered your password?</p>
          <Link to="/login" className="p-help-link">Back to Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default P_ForgotPasswordPage;
