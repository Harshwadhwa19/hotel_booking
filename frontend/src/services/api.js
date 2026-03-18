import axios from 'axios';

// In production (same Render service), use relative URL to avoid CORS and wrong-URL issues.
// In development, default to localhost:5000.
const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api');

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authService = {
  register: (userData) => api.post('/auth/register', userData),
  login: (userData) => api.post('/auth/login', userData),
  sendOtp: (email) => api.post('/auth/send-otp', { email }),
  verifyOtp: (email, otp) => api.post('/auth/verify-otp', { email, otp }),
  resetPassword: (email, password) => api.post('/auth/reset-password', { email, password }),
};

export const hotelService = {
  getAll: () => api.get('/hotels'),
  getById: (id) => api.get(`/hotels/${id}`),
  search: (query) => api.get(`/hotels/search?query=${query}`),
  filter: (params) => api.get('/hotels/filter', { params }),
};

export const bookingService = {
  create: (bookingData) => api.post('/bookings', bookingData),
  getUserBookings: () => api.get('/bookings/user'),
  cancel: (id) => api.delete(`/bookings/${id}`),
};

export const paymentService = {
  createOrder: (data) => api.post('/payment/create-order', data),
  verifyPayment: (data) => api.post('/payment/verify-payment', data),
};

export const reviewService = {
  getHotelReviews: (hotelId) => api.get(`/reviews/${hotelId}`),
  create: (reviewData) => api.post('/reviews', reviewData),
};

export const favoriteService = {
  toggle: (hotelId) => api.post('/favorites/toggle', { hotelId }),
  getUserFavorites: () => api.get('/favorites/user'),
  check: (hotelId) => api.get(`/favorites/check/${hotelId}`),
};

export const notificationService = {
  getUserNotifications: () => api.get('/notifications/user'),
};

export const couponService = {
  apply: (code) => api.post('/coupons/apply', { code }),
};

export default api;
