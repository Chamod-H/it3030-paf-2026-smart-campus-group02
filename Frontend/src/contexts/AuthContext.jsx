import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize state from localStorage if available, so sessions persist after refresh
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This runs once when the app starts. We check if they have a saved session.
    try {
      const storedUser = localStorage.getItem('user');
      const storedRole = localStorage.getItem('role');

      if (storedUser) setUser(JSON.parse(storedUser));
      if (storedRole) setRole(storedRole);
    } catch (error) {
      console.error("Failed to parse user session", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Function to call when user successfully logs in
  const login = (userData, userRole) => {
    setUser(userData);
    setRole(userRole);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('role', userRole);
  };

  // Function to call to log out
  const logout = () => {
    setUser(null);
    setRole(null);
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('token'); // E.g., removing any saved JWT
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
