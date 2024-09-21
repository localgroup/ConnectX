// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import api from '../api';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';
import { jwtDecode } from 'jwt-decode';


const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      const decoded = jwtDecode(token);
      if (decoded.exp > Date.now() / 1000) {
        fetchUser();
      } else {
        refreshToken();
      }
    } else {
      setLoading(false);
    }
  }, []);

  // Fetch user data from the API using the stored username
  const fetchUser = async () => {
    try {
      const username = localStorage.getItem('username');
      const response = await api.get(`/api/${username}/`);
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Refresh the access token using the refresh token
  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    if (!refreshToken) {
      logout();
      return;
    }

    try {
      const res = await api.post("/api/token/refresh/", {
        refresh: refreshToken
      });
      if (res.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        fetchUser();
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      logout();
    }
  };

  // Handle login process
  const login = async (username, password) => {
    try {
      const res = await api.post('/api/token/', { username, password });
      localStorage.setItem(ACCESS_TOKEN, res.data.access);
      localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
      localStorage.setItem('username', username); // Save username locally for future reference
      await fetchUser();
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  // Logout user and clear localStorage
  const logout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    localStorage.removeItem('username');
    setUser(null);
  };

  // Provide authentication context values to children
  const value = {
    user,
    login,
    logout,
    loading,
    setUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;