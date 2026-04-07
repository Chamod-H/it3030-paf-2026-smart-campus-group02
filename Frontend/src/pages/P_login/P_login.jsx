import React, { useState } from 'react';
import './p_login.css';

const P_login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Logic for login
    console.log("Login attempted with", email);
  };

  const handleGoogleLogin = () => {
    // Logic for Google OAuth
    console.log("Google Login attempted");
  };

  return (
    <div className="p_login_wrapper">
      <div className="p_login_container">
        <div className="p_login_header">
          <h2 className="p_login_title">Welcome Back</h2>
          <p className="p_login_subtitle">Please login to your account</p>
        </div>

        <form className="p_login_form" onSubmit={handleLogin}>
          <div className="p_login_input_group">
            <label className="p_login_label" htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              className="p_login_input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="p_login_input_group">
            <label className="p_login_label" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="p_login_input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="p_login_options">
            <label className="p_login_checkbox_container">
              <input type="checkbox" className="p_login_checkbox" />
              <span className="p_login_checkbox_text">Remember me</span>
            </label>
            <a href="/forgot-password" className="p_login_forgot_link">Forgot Password?</a>
          </div>

          <button type="submit" className="p_login_btn_primary">
            Sign In
          </button>
        </form>

        <div className="p_login_divider">
          <span className="p_login_divider_text">OR</span>
        </div>

        <button type="button" className="p_login_btn_google" onClick={handleGoogleLogin}>
          <svg className="p_login_google_icon" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            <path d="M1 1h22v22H1z" fill="none"/>
          </svg>
          Sign in with Google
        </button>

        <p className="p_login_register_text">
          Don't have an account? <a href="/register" className="p_login_register_link">Register</a>
        </p>
      </div>
    </div>
  );
};

export default P_login;
