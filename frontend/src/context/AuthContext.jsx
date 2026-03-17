import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await authService.login({ email, password });
      const { token, user: userData } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
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
      console.log('Attempting to register:', { name, email, phone });
      const res = await authService.register({ name, email, password, phone });
      console.log('Registration response:', res.data);
      return { success: true, email };
    } catch (err) {
      console.error('Registration error detail:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      return { success: false, error: err.response?.data?.msg || 'Registration failed' };
    }
  };

  const sendOtp = async (email) => {
    try {
      await authService.sendOtp(email);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.msg || 'Failed to send OTP' };
    }
  };

  const verifyOtp = async (email, otp) => {
    try {
      console.log(`[FRONTEND] Verifying OTP for ${email}: "${otp}"`);
      const res = await authService.verifyOtp(email, otp);
      console.log('[FRONTEND] Verification success:', res.data);
      return { success: true };
    } catch (err) {
      console.error('[FRONTEND] Verification failed:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message
      });
      return { success: false, error: err.response?.data?.msg || 'Verification failed' };
    }
  };

  const resetPassword = async (email, password) => {
    try {
      await authService.resetPassword(email, password);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.msg || 'Reset failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      register, 
      logout,
      sendOtp,
      verifyOtp,
      resetPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
