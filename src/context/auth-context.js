'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authenticated = localStorage.getItem('isAuth');
    setIsAuthenticated(authenticated === 'true');
    setLoading(false);
  }, []);

  const login = (password) => {
    if (password === process.env.NEXT_PUBLIC_SITE_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('isAuth', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuth');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
