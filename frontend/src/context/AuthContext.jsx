import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();
const BACKEND_URL = (typeof process !== 'undefined' && process.env && process.env.VITE_BACKEND_URL) 
  || (typeof window !== 'undefined' && window.VITE_BACKEND_URL)
  || "http://localhost:5000";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      if (token) {
        try {
          const res = await axios.get(`${BACKEND_URL}/api/auth/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(res.data);
        } catch (error) {
          console.error("Token validation failed", error);
          logout();
        }
      }
      setLoading(false);
    };
    validateToken();
  }, [token]);

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('token', userToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};

