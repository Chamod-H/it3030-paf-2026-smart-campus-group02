import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../../services/api';
import { validateEmailReq, validateOtpReq, validateNewPasswordReq } from '../../validation/P_forgotPasswordValidation';
import './P_LoginPage.css';

const P_ResetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If securely transitioned from the forgot page, preserve the email
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const emailErr = validateEmailReq(email);
    const otpErr = validateOtpReq(otp);
    const passErr = validateNewPasswordReq(password);

    if (emailErr || otpErr || passErr) {
      setError(emailErr || otpErr || passErr);
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/password/reset', { 
        email, 
        otpToken: otp, 
        newPassword: password 
      });
      setSuccess(response.data.message || 'Password reset successfully!');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP or unable to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-login-page">
      <div className="p-login-card">
        <div className="p-login-header">
          <div className="p-login-logo">
            <span className="p-logo-icon">🔒</span>
            <h1>Create New Password</h1>
          </div>
          <p className="p-login-subtitle">
            Enter the 6-digit OTP code sent to your email to verify your identity.
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

          <div className="p-login-field">
            <label htmlFor="otp">6-Digit OTP Code</label>
            <input 
              type="text" 
              id="otp" 
              value={otp} 
              onChange={e => setOtp(e.target.value)} 
              placeholder="e.g. 123456"
              maxLength="6"
              disabled={loading || success !== ''}
            />
          </div>
          
          <div className="p-login-field">
            <label htmlFor="password">New Password</label>
            <div className="password-input-wrapper">
              <input 
                type={showPassword ? "text" : "password"} 
                id="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="••••••••" 
                disabled={loading || success !== ''}
              />
              <button 
                type="button" 
                className="password-toggle-btn" 
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
                disabled={loading || success !== ''}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button type="submit" className="p-login-submit-btn" disabled={loading || success !== ''}>
            {loading ? 'Verifying...' : 'Reset Password Securely'}
          </button>
        </form>

        <div className="p-login-divider">
          <span>OR</span>
        </div>

        <div className="p-login-footer">
          <p>Changed your mind?</p>
          <Link to="/login" className="p-help-link">Cancel and Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default P_ResetPasswordPage;
