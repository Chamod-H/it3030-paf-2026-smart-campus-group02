import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import './P_GoogleLoginButton.css';

const P_GoogleLoginButton = ({
  onLogin,
  loading = false,
  disabled = false
}) => {
  return (
    <div className={`p-google-login-wrapper ${(disabled || loading) ? 'p-glb-disabled' : ''}`}>
      {loading ? (
        <span className="p-glb-spinner" aria-hidden="true" />
      ) : (
        <GoogleLogin
          onSuccess={credentialResponse => {
            if (onLogin) onLogin(credentialResponse);
          }}
          onError={() => {
            console.error('Google Login Failed');
          }}
          hosted_domain="my.sliit.lk"
          useOneTap={false}
        />
      )}
    </div>
  );
};

export default P_GoogleLoginButton;
