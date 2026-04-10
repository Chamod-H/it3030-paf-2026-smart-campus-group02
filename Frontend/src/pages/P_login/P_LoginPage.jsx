import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/P_AuthContext';
import P_GoogleLoginButton from '../../components/P_auth_notify/P_GoogleLoginButton';
import './P_LoginPage.css';

/**
 * Main login page for the Smart Campus System.
 * Supports standard SLIIT Student email/password login AND Google Auth.
 */
const P_LoginPage = () => {
  const { loginWithGoogle, login, loading, error } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleGoogleLogin = async () => {
    setIsRedirecting(true);
    loginWithGoogle();
  };

  const handleStandardLogin = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!email.trim() || !password) {
      setLocalError('Please enter both email and password.');
      return;
    }

    if (!email.toLowerCase().endsWith('@my.sliit.lk')) {
      setLocalError('Invalid domain. Please use your @my.sliit.lk student email.');
      return;
    }

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setLocalError(err.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="p-login-page">
      <div className="p-login-card">
        
        <div className="p-login-header">
          <div className="p-login-logo">
            <span className="p-logo-icon">🏢</span>
            <h1>Smart Campus</h1>
          </div>
          <p className="p-login-subtitle">
            Welcome back! Sign in to access your student facilities and ticketing dashboard.
          </p>
        </div>

        {(error || localError) && (
          <div className="p-login-error">
            <span className="p-error-icon">⚠️</span>
            {localError || error}
          </div>
        )}

        <form className="p-login-standard-form" onSubmit={handleStandardLogin}>
          <div className="p-login-field">
            <label htmlFor="email">Student Email</label>
            <input 
              type="email" 
              id="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="e.g. it2026xxxx@my.sliit.lk" 
            />
          </div>
          
          <div className="p-login-field">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input 
                type={showPassword ? "text" : "password"} 
                id="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="••••••••" 
              />
              <button 
                type="button" 
                className="password-toggle-btn" 
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button type="submit" className="p-login-submit-btn" disabled={loading || isRedirecting}>
            Sign In Securely
          </button>
        </form>

        <div className="p-login-divider">
          <span>OR</span>
        </div>

        <div className="p-login-actions">
          <P_GoogleLoginButton 
            onLogin={handleGoogleLogin} 
            loading={loading || isRedirecting} 
          />
        </div>

        <div className="p-login-footer">
          <p>Don't have a secure student account?</p>
          <Link to="/profile/setup" className="p-help-link">Register Student Account</Link>
        </div>
      </div>
    </div>
  );
};

export default P_LoginPage;
