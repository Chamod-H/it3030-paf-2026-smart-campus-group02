import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

/**
 * Global authentication state manager.
 * Stores user data, tokens, and provide auth-related methods.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('smart_campus_token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Mock: Fetch current user details from API.
   * Linked to the current token.
   */
  const fetchCurrentUser = useCallback(async (authToken) => {
    setLoading(true);
    try {
      // Logic for real API: const res = await axios.get('/api/auth/me', { headers: { Authorization: `Bearer ${authToken}` } });
      // Mock: Simulate small delay
      await new Promise(r => setTimeout(r, 800));
      
      const storedUser = localStorage.getItem('smart_campus_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        // Fallback mock user if token exists but no user in storage
        setUser({ name: 'Dana Perera', email: 'd.perera@example.com', role: 'student' });
      }
      setError(null);
    } catch (err) {
      setError('Failed to fetch user session.');
      logout();
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial session recovery — only runs once on mount to restore a previous session.
  // We do NOT re-run this when `token` changes (e.g. after login) because login() already
  // sets user directly. Re-running would cause a loading flash that blanks the dashboard.
  useEffect(() => {
    const storedToken = localStorage.getItem('smart_campus_token');
    const storedUser = localStorage.getItem('smart_campus_user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []); // empty deps = mount only

  /**
   * Redirects to the Google OAuth endpoint.
   */
  const loginWithGoogle = () => {
    setLoading(true);
    // Logic: window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`;
    console.log('Redirecting to Google OAuth...');
    // Real implementation will handle the redirect
  };

  /**
   * Authenticate with email + password against the backend.
   * Stores the JWT and user info in localStorage on success.
   */
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Invalid credentials.');
      }

      const data = await res.json();
      // Backend returns: { token: "...", user: { id, name, email, role } }
      const { token: jwtToken, user: userData } = data;

      localStorage.setItem('smart_campus_token', jwtToken);
      localStorage.setItem('smart_campus_user', JSON.stringify(userData));
      setToken(jwtToken);
      setUser(userData);
    } catch (err) {
      setError(err.message || 'Login failed.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Clears session data.
   */
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('smart_campus_token');
    localStorage.removeItem('smart_campus_user');
    setError(null);
  };

  /**
   * Manually update the user object if needed.
   */
  const updateLocalUser = (userData) => {
    setUser(userData);
    localStorage.setItem('smart_campus_user', JSON.stringify(userData));
  };

  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!user && !!token,
    isAdmin: user?.role === 'admin' || user?.role === 'ADMIN',
    login,
    loginWithGoogle,
    logout,
    fetchCurrentUser,
    setUser: updateLocalUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
