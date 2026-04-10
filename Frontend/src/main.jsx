import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './contexts/P_AuthContext.jsx'
import { NotificationProvider } from './contexts/P_NotificationContext.jsx'

// YOU MUST REPLACE THIS WITH A REAL GOOGLE CLIENT ID FOR THE POPUP TO WORK
const GOOGLE_CLIENT_ID = "57212192480-ldl2os79cr0u16r48125ej8mrbqho2qd.apps.googleusercontent.com";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
