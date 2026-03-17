import React, { createContext, useState, useEffect, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedUser = async () => {
      try {
        const storedUser = await SecureStore.getItemAsync('user');
        const token = await SecureStore.getItemAsync('token');
        if (storedUser && token) {
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.error('Failed to load user', e);
      } finally {
        setLoading(false);
      }
    };
    checkLoggedUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user: userData } = res.data;
      await SecureStore.setItemAsync('token', token);
      await SecureStore.setItemAsync('user', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (err) {
      if (err.response?.status === 401 && err.response?.data?.unverified) {
        return { success: false, unverified: true, email };
      }
      return { success: false, error: err.response?.data?.msg || 'Login failed' };
    }
  };

  const register = async (name, email, password, phone) => {
    try {
      const res = await api.post('/auth/register', { name, email, password, phone });
      return { success: true, email: res.data.email };
    } catch (err) {
      return { success: false, error: err.response?.data?.msg || 'Registration failed' };
    }
  };

  const verifyOtp = async (email, otp) => {
    try {
      const res = await api.post('/auth/verify-otp', { email, otp });
      return { success: true, message: res.data.msg };
    } catch (err) {
      return { success: false, error: err.response?.data?.msg || 'Verification failed' };
    }
  };

  const sendOtp = async (email) => {
    try {
      const res = await api.post('/auth/send-otp', { email });
      return { success: true, message: res.data.msg };
    } catch (err) {
      return { success: false, error: err.response?.data?.msg || 'Failed to send OTP' };
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, verifyOtp, sendOtp, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
