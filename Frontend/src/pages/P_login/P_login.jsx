import React, { useState } from 'react';
import './p_login.css';

const P_login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Normal login logic would go here
    console.log('Login attempt with:', email, password);
  };

  const handleGoogleSignIn = () => {
    // OAuth logic would go here
    console.log('Google sign-in clicked');
  };

  return (
    <div className="p_login-page-container">
      <div className="p_login-card">
        <div className="p_login-header">
          <h1 className="p_login-title">Welcome Back</h1>
          <p className="p_login-subtitle">Please enter your details to sign in.</p>
        </div>

        <form className="p_login-form" onSubmit={handleLogin}>
          <div className="p_login-input-group">
            <label className="p_login-label" htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              className="p_login-input" 
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="p_login-input-group">
            <label className="p_login-label" htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              className="p_login-input" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="p_login-actions">
            <div className="p_login-remember">
              <input type="checkbox" id="remember" className="p_login-checkbox" />
              <label htmlFor="remember" className="p_login-remember-text">Remember for 30 days</label>
            </div>
            <a href="#" className="p_login-forgot-link">Forgot password?</a>
          </div>

          <button type="submit" className="p_login-btn-primary">Sign In</button>
        </form>

        <div className="p_login-divider">
          <span className="p_login-divider-text">OR</span>
        </div>

        <button 
          type="button" 
          className="p_login-btn-google" 
          onClick={handleGoogleSignIn}
        >
          <svg className="p_login-google-icon" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Sign in with Google
        </button>

        <p className="p_login-signup-prompt">
          Don't have an account? <a href="#" className="p_login-signup-link">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default P_login;
